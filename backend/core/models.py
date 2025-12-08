from django.db import models

class TimeStampedModel(models.Model):
    """
    An abstract base class model that provides self-updating
    'created_at' and 'updated_at' fields.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class AuditLog(models.Model):
    admin = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True)
    action_type = models.CharField(max_length=50)
    description = models.TextField()
    target_type = models.CharField(max_length=50)
    target_id = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.admin} - {self.action_type}"
