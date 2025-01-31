import 'package:flutter/material.dart';
import 'package:frip/pages/onboarding.dart';
import 'package:frip/pages/splash.dart';
// import 'package:frip/pages/signin.dart';

void main() {
  runApp(const Frip());
}

class Frip extends StatelessWidget {
  const Frip({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Frip',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      initialRoute: "/",
      routes: {
        "/": (context) => const SplashScreen(),
        "/onboarding": (context) => const OnboardingScreen(),
        // "/signin": (context) => const SignIn(),
      },
    );
  }
}