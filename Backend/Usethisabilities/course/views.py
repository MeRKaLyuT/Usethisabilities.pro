from django.db.models import Q
from django.shortcuts import get_object_or_404

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Course, Lesson, UserCourse, Status
from .permissions import IsCourseAuthorOrReadOnly, IsLessonCourseAuthorOrReadOnly
from .serializers import (
    CourseCatalogSerializer,
    CourseMyListSerializer,
    CourseDetailSerializer,
    CourseWriteSerializer,
    LessonListSerializer,
    LessonDetailSerializer,
    LessonWriteSerializer,
    UserCourseSerializer,
)


class CourseListCreateView(generics.ListCreateAPIView):
    queryset = Course.objects.select_related("author").all()

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.request.method == "GET":
            return (
                Course.objects
                .select_related("author")
                .filter(status=Status.PUBLISHED)
                .order_by("-created_at")
            )
        return Course.objects.select_related("author").all()

    def get_serializer_class(self):
        if self.request.method == "GET":
            return CourseCatalogSerializer
        return CourseWriteSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class MyCourseListView(generics.ListAPIView):
    serializer_class = CourseMyListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Course.objects
            .select_related("author")
            .filter(author=self.request.user)
            .order_by("-updated_at")
        )


class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /courses/<id>/         -> detail (published for public, all statuses for author)
    PATCH /courses/<id>/       -> author only
    DELETE /courses/<id>/      -> author only
    """
    permission_classes = [IsCourseAuthorOrReadOnly]

    def get_queryset(self):
        user = self.request.user

        base_qs = Course.objects.select_related("author").all()

        if user.is_authenticated:
            return base_qs.filter(
                Q(status=Status.PUBLISHED) | Q(author=user)
            ).distinct()

        return base_qs.filter(status=Status.PUBLISHED)

    def get_serializer_class(self):
        if self.request.method in ("PATCH", "PUT"):
            return CourseWriteSerializer
        return CourseDetailSerializer


class CourseStartView(APIView):
    """
    POST /courses/<id>/start/  -> create/get UserCourse for current user
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        course = get_object_or_404(Course, pk=pk, status=Status.PUBLISHED)

        user_course, created = UserCourse.objects.get_or_create(
            user=request.user,
            course=course,
            defaults={"status": UserCourse.StudyStatus.ACTIVE},
        )

        serializer = UserCourseSerializer(user_course)

        if created:
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LessonListCreateView(generics.ListCreateAPIView):
    """
    GET /courses/<course_id>/lessons/              -> visible lessons list
    POST /courses/<course_id>/lessons/             -> create lesson (course author only)
    """

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_course_for_write(self):
        course = get_object_or_404(Course, pk=self.kwargs["course_pk"])
        if course.author_id != self.request.user.id:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only course author can create lessons.")
        return course

    def get_course_for_read(self):
        course_id = self.kwargs["course_pk"]
        user = self.request.user

        qs = Course.objects.all()
        if user.is_authenticated:
            return get_object_or_404(
                qs.filter(Q(status=Status.PUBLISHED) | Q(author=user)).distinct(),
                pk=course_id,
            )
        return get_object_or_404(qs.filter(status=Status.PUBLISHED), pk=course_id)

    def get_queryset(self):
        course = self.get_course_for_read()

        qs = Lesson.objects.filter(course=course).order_by("order")

        user = self.request.user
        if user.is_authenticated and course.author_id == user.id:
            return qs  # author sees all
        return qs.filter(status=Status.PUBLISHED)  # others only published

    def get_serializer_class(self):
        if self.request.method == "GET":
            return LessonListSerializer
        return LessonWriteSerializer

    def perform_create(self, serializer):
        course = self.get_course_for_write()
        serializer.save(course=course)


class LessonDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /courses/<course_id>/lessons/<id>/
    PATCH /courses/<course_id>/lessons/<id>/       -> author only
    DELETE /courses/<course_id>/lessons/<id>/      -> author only
    """
    permission_classes = [IsLessonCourseAuthorOrReadOnly]

    def get_queryset(self):
        course_id = self.kwargs["course_pk"]
        user = self.request.user

        qs = (
            Lesson.objects
            .select_related("course", "course__author")
            .filter(course_id=course_id)
            .order_by("order")
        )

        if user.is_authenticated:
            author_visible = qs.filter(course__author=user)
            if author_visible.exists():
                return qs

        return qs.filter(
            status=Status.PUBLISHED,
            course__status=Status.PUBLISHED,
        )

    def get_serializer_class(self):
        if self.request.method in ("PATCH", "PUT"):
            return LessonWriteSerializer
        return LessonDetailSerializer


class CourseDeleteView(generics.DestroyAPIView):
    queryset = Course.objects.select_related("author")
    permission_classes = [IsAuthenticated, IsCourseAuthorOrReadOnly]


class MyStartedCourseListView(generics.ListAPIView):
    """
    GET /courses/my/started/  -> courses started by current user
    """
    serializer_class = UserCourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            UserCourse.objects
            .select_related("course", "course__author")
            .filter(
                user=self.request.user,
                status=UserCourse.StudyStatus.ACTIVE,
                course__status=Status.PUBLISHED,
            )
            .order_by("-completed_at")
        )
