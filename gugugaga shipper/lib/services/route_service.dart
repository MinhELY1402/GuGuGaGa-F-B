// [WIP] Naive straight-line calculation
import 'dart:math';
class RouteService {
  static double getDistance(double lat1, double lon1, double lat2, double lon2) {
    return sqrt(pow(lat2 - lat1, 2) + pow(lon2 - lon1, 2)) * 111.0;
  }
}
