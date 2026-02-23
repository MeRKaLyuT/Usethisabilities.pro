from rest_framework import serializers

from .models import Course, Lesson, UserCourse


class CourseCatalogSerializer(serializers.ModelSerializer):
    author_id = serializers.IntegerField(source="author.id", read_only=True)

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "author_id",
            "created_at",
            "updated_at",
        ]


class CourseMyListSerializer(serializers.ModelSerializer):
    author_id = serializers.IntegerField(source="author.id", read_only=True)

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "author_id",
            "status",
            "created_at",
            "updated_at",
        ]


class CourseDetailSerializer(serializers.ModelSerializer):
    author_id = serializers.IntegerField(source="author.id", read_only=True)
    lessons_count = serializers.SerializerMethodField()
    published_lessons_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "author_id",
            "status",
            "created_at",
            "updated_at",
            "lessons_count",
            "published_lessons_count",
        ]

    def get_lessons_count(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated and obj.author_id == request.user.id:
            return obj.lessons.count()
        return obj.lessons.filter(status="published").count()

    def get_published_lessons_count(self, obj):
        return obj.lessons.filter(status="published").count()


class CourseWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "status",
        ]
        read_only_fields = ["id"]

    def validate_title(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Title cannot be empty.")
        return value


class LessonListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = [
            "id",
            "course",
            "title",
            "order",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "course",
            "created_at",
            "updated_at",
        ]


class LessonDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = [
            "id",
            "course",
            "title",
            "order",
            "status",
            "body",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "course",
            "created_at",
            "updated_at",
        ]


class LessonWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = [
            "id",
            "title",
            "order",
            "status",
            "body",
        ]
        read_only_fields = ["id"]

    def validate_title(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Title cannot be empty.")
        return value


class UserCourseSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source="user.id", read_only=True)
    course_id = serializers.IntegerField(source="course.id", read_only=True)

    class Meta:
        model = UserCourse
        fields = [
            "id",
            "user_id",
            "course_id",
            "status",
            "started_at",
            "last_activity_at",
            "completed_at",
        ]
        read_only_fields = [
            "id",
            "user_id",
            "course_id",
            "started_at",
            "last_activity_at",
            "completed_at",
        ]