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

