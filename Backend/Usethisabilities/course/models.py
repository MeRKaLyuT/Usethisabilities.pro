from django.db import models
from django.conf import settings


class Status(models.TextChoices):
    DRAFT = "draft", "Draft"  # two variants because first one is for APIs and second one for people
    PUBLISHED = "published", "Published"
    ARCHIVED = "archived", "Archived"


class Course(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="authored_courses",
    )
    users = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        through='UserCourse',
        related_name='courses',
        blank=True
    )
    title = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    status = models.CharField(
        max_length=20,
        choices = Status.choices,
        default=Status.DRAFT,
    )


class Lesson(models.Model):
    course = models.ForeignKey(
        'Course',
        on_delete=models.CASCADE,
        related_name='lessons',
    )
    title = models.CharField(max_length=100)
    order = models.PositiveIntegerField()
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
    )
    body = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["course", "order"], name="uniq_lesson_order_per_course")
        ]
        ordering = ["order"]


class LessonCompletion(models.Model):
    user_course = models.ForeignKey("UserCourse", on_delete=models.CASCADE, related_name="completions")
    lesson = models.ForeignKey("Lesson", on_delete=models.CASCADE)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user_course", "lesson"], name="uniq_completion")
        ]
        indexes = [
            models.Index(fields=["user_course"]),
        ]


class UserCourse(models.Model):
    class StudyStatus(models.TextChoices):
        ACTIVE = "active", "Active"
        COMPLETED = "completed", "Completed"
        PAUSED = "paused", "Paused"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='user_courses'
    )
    course = models.ForeignKey(
        'Course',
        on_delete=models.CASCADE,
        related_name='user_courses'
    )
    status = models.CharField(
        max_length=20,
        choices=StudyStatus.choices,
        default=StudyStatus.ACTIVE,
    )
    started_at = models.DateTimeField(auto_now_add=True)
    last_activity_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "course",],
                name="uniq_user_course",
            )
        ]
        indexes = [
            models.Index(fields=["course"]),
            models.Index(fields=["user"]),
        ]
