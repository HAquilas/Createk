import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  bool _mounted = true;

  @override
  void initState() {
    super.initState();
    _isFirstTime();
  }

  @override
  void dispose() {
    _mounted = false;
    super.dispose();
  }

  Future<void> _isFirstTime() async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      bool isFirstTime = prefs.getBool("first_time") ?? true;

      await Future.delayed(const Duration(seconds: 1));

      if (!_mounted) return;

      if (isFirstTime) {
        await prefs.setBool("first_time", false);
        if (!_mounted) return;
        Navigator.pushReplacementNamed(context, "/onboarding");
      } else {
        if (!_mounted) return;
        Navigator.pushReplacementNamed(context, "/signin");
      }
    } catch (e) {
      debugPrint("Error in splash screen: $e");
      if (_mounted) {
        Navigator.pushReplacementNamed(context, "/onboarding");
      }
    }
  }

  Future<bool> _checkAuthentication() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getString('userToken') != null;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 10, 101, 146),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(
              'assets/logo/Frip.png',
              width: 200,
              height: 200,
            ),
            const SizedBox(height: 20),
            const CircularProgressIndicator(
              color: Colors.black,
            ),
          ],
        ),
      ),
    );
  }
}
