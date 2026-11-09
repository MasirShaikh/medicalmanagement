from rest_framework.routers import DefaultRouter

from .views import DepartmentViewSet, DoctorViewSet

router = DefaultRouter()
router.register("departments", DepartmentViewSet, basename="department")
router.register("", DoctorViewSet, basename="doctor")

urlpatterns = router.urls
