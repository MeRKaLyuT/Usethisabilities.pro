from django.urls import path

from .views import (
    CourseListCreateView,
    MyCourseListView,
    CourseDetailView,
    CourseStartView,
    LessonListCreateView,
    LessonDetailView,
)

urlpatterns = [
    # Courses
    path("", CourseListCreateView.as_view(), name="course-list-create"),
    path("my/", MyCourseListView.as_view(), name="course-my-list"),
    path("<int:pk>/start/", CourseStartView.as_view(), name="course-start"),
    path("<int:pk>/", CourseDetailView.as_view(), name="course-detail"),

    # Lessons (nested)
    path("<int:course_pk>/lessons/", LessonListCreateView.as_view(), name="lesson-list-create"),
    path("<int:course_pk>/lessons/<int:pk>/", LessonDetailView.as_view(), name="lesson-detail"),
]