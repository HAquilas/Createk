import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({Key? key}) : super(key: key);

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  late PageController _pageController;

  int _pageIndex = 0;
  @override
  void initState() {
    _pageController = PageController(initialPage: 0);
    super.initState();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              Expanded(
                child: PageView.builder(
                  itemCount: onboards.length,
                  controller: _pageController,
                  onPageChanged: (index) {
                    setState(() {
                      _pageIndex = index;
                    });
                  },
                  itemBuilder: (context, index) => OnBoardContent(
                    image: onboards[index].image,
                    title: onboards[index].title,
                    description: onboards[index].description
                  ),
                ),
              ),
              Row(
                children: [
                  ...List.generate(
                    onboards.length, 
                    (index) => Padding(
                      padding: EdgeInsets.only(right: 4),
                      child: DotIndicator(
                        isActive: index == _pageIndex,
                      ),
                    )
                  ),
                  const Spacer(),
                  SizedBox(
                    width: 60,
                    height: 60,
                    child: ElevatedButton(
                      onPressed: () {
                        _pageController.nextPage(
                          duration: const Duration(milliseconds: 300),
                          curve: Curves.ease
                        );
                      },
                      child: SvgPicture.asset("assets/icons/Arrow - Right.svg"),
                      style: ElevatedButton.styleFrom(
                        shape: const CircleBorder()
                      ),
                      
                    )
                  ),
                ],
              )
            ],
          )
        )
      )
    );
  }
}

class DotIndicator extends StatelessWidget {
  const DotIndicator({
    super.key,
    this.isActive = false
  });

  final bool isActive;
  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: Duration(milliseconds: 300),
      height: isActive ? 12 : 4,
      width: 4,
      decoration: BoxDecoration(
        color: isActive ? Colors.blue : const Color.fromARGB(139, 33, 149, 243),
        borderRadius: BorderRadius.all(Radius.circular(12))
      ),
    );
  }
}

