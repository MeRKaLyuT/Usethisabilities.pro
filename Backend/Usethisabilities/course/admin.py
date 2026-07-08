from django.contrib import admin

from .models import Course

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    model = Course
    list_display = ("id", "author", "title", "status", "created_at", "updated_at")
    list_filter = ("status", "created_at", "updated_at")
    search_fields = ("author__username", "author__email", "title")
    ordering = ("-created_at", )
    readonly_fields = ("created_at", "updated_at")

    fieldsets = (
        (None, {"fields": ("author", "title", "status")}),
        ("Dates", {"fields": ("created_at", "updated_at")}),
    )

