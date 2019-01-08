var laya;
(function (laya) {
    var M_PI_X_2 = Math.PI * 2.0;
    var TweenFunc;
    (function (TweenFunc) {
        var TweenType;
        (function (TweenType) {
            TweenType[TweenType["CUSTOM_EASING"] = -1] = "CUSTOM_EASING";
            TweenType[TweenType["Linear"] = 0] = "Linear";
            TweenType[TweenType["Sine_EaseIn"] = 1] = "Sine_EaseIn";
            TweenType[TweenType["Sine_EaseOut"] = 2] = "Sine_EaseOut";
            TweenType[TweenType["Sine_EaseInOut"] = 3] = "Sine_EaseInOut";
            TweenType[TweenType["Quad_EaseIn"] = 4] = "Quad_EaseIn";
            TweenType[TweenType["Quad_EaseOut"] = 5] = "Quad_EaseOut";
            TweenType[TweenType["Quad_EaseInOut"] = 6] = "Quad_EaseInOut";
            TweenType[TweenType["Cubic_EaseIn"] = 7] = "Cubic_EaseIn";
            TweenType[TweenType["Cubic_EaseOut"] = 8] = "Cubic_EaseOut";
            TweenType[TweenType["Cubic_EaseInOut"] = 9] = "Cubic_EaseInOut";
            TweenType[TweenType["Quart_EaseIn"] = 10] = "Quart_EaseIn";
            TweenType[TweenType["Quart_EaseOut"] = 11] = "Quart_EaseOut";
            TweenType[TweenType["Quart_EaseInOut"] = 12] = "Quart_EaseInOut";
            TweenType[TweenType["Quint_EaseIn"] = 13] = "Quint_EaseIn";
            TweenType[TweenType["Quint_EaseOut"] = 14] = "Quint_EaseOut";
            TweenType[TweenType["Quint_EaseInOut"] = 15] = "Quint_EaseInOut";
            TweenType[TweenType["Expo_EaseIn"] = 16] = "Expo_EaseIn";
            TweenType[TweenType["Expo_EaseOut"] = 17] = "Expo_EaseOut";
            TweenType[TweenType["Expo_EaseInOut"] = 18] = "Expo_EaseInOut";
            TweenType[TweenType["Circ_EaseIn"] = 19] = "Circ_EaseIn";
            TweenType[TweenType["Circ_EaseOut"] = 20] = "Circ_EaseOut";
            TweenType[TweenType["Circ_EaseInOut"] = 21] = "Circ_EaseInOut";
            TweenType[TweenType["Elastic_EaseIn"] = 22] = "Elastic_EaseIn";
            TweenType[TweenType["Elastic_EaseOut"] = 23] = "Elastic_EaseOut";
            TweenType[TweenType["Elastic_EaseInOut"] = 24] = "Elastic_EaseInOut";
            TweenType[TweenType["Back_EaseIn"] = 25] = "Back_EaseIn";
            TweenType[TweenType["Back_EaseOut"] = 26] = "Back_EaseOut";
            TweenType[TweenType["Back_EaseInOut"] = 27] = "Back_EaseInOut";
            TweenType[TweenType["Bounce_EaseIn"] = 28] = "Bounce_EaseIn";
            TweenType[TweenType["Bounce_EaseOut"] = 29] = "Bounce_EaseOut";
            TweenType[TweenType["Bounce_EaseInOut"] = 30] = "Bounce_EaseInOut";
            TweenType[TweenType["TWEEN_EASING_MAX"] = 10000] = "TWEEN_EASING_MAX";
        })(TweenType = TweenFunc.TweenType || (TweenFunc.TweenType = {}));
        ;
        function easeIn(time, rate) {
            return Math.pow(time, rate);
        }
        TweenFunc.easeIn = easeIn;
        function easeOut(time, rate) {
            return Math.pow(time, 1 / rate);
        }
        TweenFunc.easeOut = easeOut;
        function easeInOut(time, rate) {
            time *= 2;
            if (time < 1)
                return 0.5 * Math.pow(time, rate);
            else
                return (1.0 - 0.5 * Math.pow(2 - time, rate));
        }
        TweenFunc.easeInOut = easeInOut;
        function bezieratFunction(a, b, c, d, t) {
            return (Math.pow(1 - t, 3) * a + 3 * t * (Math.pow(1 - t, 2)) * b + 3 * Math.pow(t, 2) * (1 - t) * c + Math.pow(t, 3) * d);
        }
        TweenFunc.bezieratFunction = bezieratFunction;
        function quadraticIn(time) {
            return Math.pow(time, 2);
        }
        TweenFunc.quadraticIn = quadraticIn;
        function quadraticOut(time) {
            return -time * (time - 2);
        }
        TweenFunc.quadraticOut = quadraticOut;
        function quadraticInOut(time) {
            var resultTime = time;
            time = time * 2;
            if (time < 1) {
                resultTime = time * time * 0.5;
            }
            else {
                --time;
                resultTime = -0.5 * (time * (time - 2) - 1);
            }
            return resultTime;
        }
        TweenFunc.quadraticInOut = quadraticInOut;
        function linear(time) {
            return time;
        }
        TweenFunc.linear = linear;
        function sineEaseIn(time) {
            return -1 * Math.cos(time * M_PI_X_2) + 1;
        }
        TweenFunc.sineEaseIn = sineEaseIn;
        function sineEaseOut(time) {
            return Math.sin(time * M_PI_X_2);
        }
        TweenFunc.sineEaseOut = sineEaseOut;
        function sineEaseInOut(time) {
            return -0.5 * (Math.cos(Math.PI * time) - 1);
        }
        TweenFunc.sineEaseInOut = sineEaseInOut;
        function quadEaseIn(time) {
            return time * time;
        }
        TweenFunc.quadEaseIn = quadEaseIn;
        function quadEaseOut(time) {
            return -1 * time * (time - 2);
        }
        TweenFunc.quadEaseOut = quadEaseOut;
        function quadEaseInOut(time) {
            time = time * 2;
            if (time < 1)
                return 0.5 * time * time;
            --time;
            return -0.5 * (time * (time - 2) - 1);
        }
        TweenFunc.quadEaseInOut = quadEaseInOut;
        function cubicEaseIn(time) {
            return time * time * time;
        }
        TweenFunc.cubicEaseIn = cubicEaseIn;
        function cubicEaseOut(time) {
            time = -1;
            return (time * time * time + 1);
        }
        TweenFunc.cubicEaseOut = cubicEaseOut;
        function cubicEaseInOut(time) {
            time = time * 2;
            if (time < 1)
                return 0.5 * time * time * time;
            time -= 2;
            return 0.5 * (time * time * time + 2);
        }
        TweenFunc.cubicEaseInOut = cubicEaseInOut;
        function quartEaseIn(time) {
            return time * time * time * time;
        }
        TweenFunc.quartEaseIn = quartEaseIn;
        function quartEaseOut(time) {
            time = -1;
            return -(time * time * time * time - 1);
        }
        TweenFunc.quartEaseOut = quartEaseOut;
        function quartEaseInOut(time) {
            time = time * 2;
            if (time < 1)
                return 0.5 * time * time * time * time;
            time -= 2;
            return -0.5 * (time * time * time * time - 2);
        }
        TweenFunc.quartEaseInOut = quartEaseInOut;
        function quintEaseIn(time) {
            return time * time * time * time * time;
        }
        TweenFunc.quintEaseIn = quintEaseIn;
        function quintEaseOut(time) {
            time -= 1;
            return (time * time * time * time * time + 1);
        }
        TweenFunc.quintEaseOut = quintEaseOut;
        function quintEaseInOut(time) {
            time = time * 2;
            if (time < 1)
                return 0.5 * time * time * time * time * time;
            time -= 2;
            return 0.5 * (time * time * time * time * time + 2);
        }
        TweenFunc.quintEaseInOut = quintEaseInOut;
        // Expo Ease
        function expoEaseIn(time) {
            return time == 0 ? 0 : Math.pow(2, 10 * (time / 1 - 1)) - 1 * 0.001;
        }
        TweenFunc.expoEaseIn = expoEaseIn;
        function expoEaseOut(time) {
            return time == 1 ? 1 : (-Math.pow(2, -10 * time / 1) + 1);
        }
        TweenFunc.expoEaseOut = expoEaseOut;
        function expoEaseInOut(time) {
            if (time == 0 || time == 1)
                return time;
            if (time < 0.5)
                return 0.5 * Math.pow(2, 10 * (time * 2 - 1));
            return 0.5 * (-Math.pow(2, -10 * (time * 2 - 1)) + 2);
        }
        TweenFunc.expoEaseInOut = expoEaseInOut;
        // Circ Ease
        function circEaseIn(time) {
            return -1 * (Math.sqrt(1 - time * time) - 1);
        }
        TweenFunc.circEaseIn = circEaseIn;
        function circEaseOut(time) {
            time = time - 1;
            return Math.sqrt(1 - time * time);
        }
        TweenFunc.circEaseOut = circEaseOut;
        function circEaseInOut(time) {
            time = time * 2;
            if (time < 1)
                return -0.5 * (Math.sqrt(1 - time * time) - 1);
            time -= 2;
            return 0.5 * (Math.sqrt(1 - time * time) + 1);
        }
        TweenFunc.circEaseInOut = circEaseInOut;
        // Elastic Ease
        function elasticEaseIn(time, period) {
            var newT = 0;
            if (time == 0 || time == 1) {
                newT = time;
            }
            else {
                var s = period / 4;
                time = time - 1;
                newT = -Math.pow(2, 10 * time) * Math.sin((time - s) * M_PI_X_2 / period);
            }
            return newT;
        }
        TweenFunc.elasticEaseIn = elasticEaseIn;
        function elasticEaseOut(time, period) {
            var newT = 0;
            if (time == 0 || time == 1) {
                newT = time;
            }
            else {
                var s = period / 4;
                newT = Math.pow(2, -10 * time) * Math.sin((time - s) * M_PI_X_2 / period) + 1;
            }
            return newT;
        }
        TweenFunc.elasticEaseOut = elasticEaseOut;
        function elasticEaseInOut(time, period) {
            var newT = 0;
            if (time == 0 || time == 1) {
                newT = time;
            }
            else {
                time = time * 2;
                if (!period) {
                    period = 0.3 * 1.5;
                }
                var s = period / 4;
                time = time - 1;
                if (time < 0) {
                    newT = -0.5 * Math.pow(2, 10 * time) * Math.sin((time - s) * M_PI_X_2 / period);
                }
                else {
                    newT = Math.pow(2, -10 * time) * Math.sin((time - s) * M_PI_X_2 / period) * 0.5 + 1;
                }
            }
            return newT;
        }
        TweenFunc.elasticEaseInOut = elasticEaseInOut;
        // Back Ease
        function backEaseIn(time) {
            var overshoot = 1.70158;
            return time * time * ((overshoot + 1) * time - overshoot);
        }
        TweenFunc.backEaseIn = backEaseIn;
        function backEaseOut(time) {
            var overshoot = 1.70158;
            time = time - 1;
            return time * time * ((overshoot + 1) * time + overshoot) + 1;
        }
        TweenFunc.backEaseOut = backEaseOut;
        function backEaseInOut(time) {
            var overshoot = 1.70158 * 1.525;
            time = time * 2;
            if (time < 1) {
                return (time * time * ((overshoot + 1) * time - overshoot)) / 2;
            }
            else {
                time = time - 2;
                return (time * time * ((overshoot + 1) * time + overshoot)) / 2 + 1;
            }
        }
        TweenFunc.backEaseInOut = backEaseInOut;
        // Bounce Ease
        function bounceTime(time) {
            if (time < 1 / 2.75) {
                return 7.5625 * time * time;
            }
            else if (time < 2 / 2.75) {
                time -= 1.5 / 2.75;
                return 7.5625 * time * time + 0.75;
            }
            else if (time < 2.5 / 2.75) {
                time -= 2.25 / 2.75;
                return 7.5625 * time * time + 0.9375;
            }
            time -= 2.625 / 2.75;
            return 7.5625 * time * time + 0.984375;
        }
        TweenFunc.bounceTime = bounceTime;
        function bounceEaseIn(time) {
            return 1 - bounceTime(1 - time);
        }
        TweenFunc.bounceEaseIn = bounceEaseIn;
        function bounceEaseOut(time) {
            return bounceTime(time);
        }
        TweenFunc.bounceEaseOut = bounceEaseOut;
        function bounceEaseInOut(time) {
            var newT = 0;
            if (time < 0.5) {
                time = time * 2;
                newT = (1 - bounceTime(1 - time)) * 0.5;
            }
            else {
                newT = bounceTime(time * 2 - 1) * 0.5 + 0.5;
            }
            return newT;
        }
        TweenFunc.bounceEaseInOut = bounceEaseInOut;
        // Custom Ease
        function customEase(time, easingParam) {
            if (easingParam) {
                var tt = 1 - time;
                return easingParam[1] * tt * tt * tt + 3 * easingParam[3] * time * tt * tt + 3 * easingParam[5] * time * time * tt + easingParam[7] * time * time * time;
            }
            return time;
        }
        TweenFunc.customEase = customEase;
        function tweenTo(time, type, easingParam) {
            var delta = 0;
            switch (type) {
                case TweenType.CUSTOM_EASING:
                    delta = customEase(time, easingParam);
                    break;
                case TweenType.Linear:
                    delta = linear(time);
                    break;
                case TweenType.Sine_EaseIn:
                    delta = sineEaseIn(time);
                    break;
                case TweenType.Sine_EaseOut:
                    delta = sineEaseOut(time);
                    break;
                case TweenType.Sine_EaseInOut:
                    delta = sineEaseInOut(time);
                    break;
                case TweenType.Quad_EaseIn:
                    delta = quadEaseIn(time);
                    break;
                case TweenType.Quad_EaseOut:
                    delta = quadEaseOut(time);
                    break;
                case TweenType.Quad_EaseInOut:
                    delta = quadEaseInOut(time);
                    break;
                case TweenType.Cubic_EaseIn:
                    delta = cubicEaseIn(time);
                    break;
                case TweenType.Cubic_EaseOut:
                    delta = cubicEaseOut(time);
                    break;
                case TweenType.Cubic_EaseInOut:
                    delta = cubicEaseInOut(time);
                    break;
                case TweenType.Quart_EaseIn:
                    delta = quartEaseIn(time);
                    break;
                case TweenType.Quart_EaseOut:
                    delta = quartEaseOut(time);
                    break;
                case TweenType.Quart_EaseInOut:
                    delta = quartEaseInOut(time);
                    break;
                case TweenType.Quint_EaseIn:
                    delta = quintEaseIn(time);
                    break;
                case TweenType.Quint_EaseOut:
                    delta = quintEaseOut(time);
                    break;
                case TweenType.Quint_EaseInOut:
                    delta = quintEaseInOut(time);
                    break;
                case TweenType.Expo_EaseIn:
                    delta = expoEaseIn(time);
                    break;
                case TweenType.Expo_EaseOut:
                    delta = expoEaseOut(time);
                    break;
                case TweenType.Expo_EaseInOut:
                    delta = expoEaseInOut(time);
                    break;
                case TweenType.Circ_EaseIn:
                    delta = circEaseIn(time);
                    break;
                case TweenType.Circ_EaseOut:
                    delta = circEaseOut(time);
                    break;
                case TweenType.Circ_EaseInOut:
                    delta = circEaseInOut(time);
                    break;
                case TweenType.Elastic_EaseIn:
                    {
                        var period = 0.3;
                        if (null != easingParam) {
                            period = easingParam[0];
                        }
                        delta = elasticEaseIn(time, period);
                    }
                    break;
                case TweenType.Elastic_EaseOut:
                    {
                        var period = 0.3;
                        if (null != easingParam) {
                            period = easingParam[0];
                        }
                        delta = elasticEaseOut(time, period);
                    }
                    break;
                case TweenType.Elastic_EaseInOut:
                    {
                        var period = 0.3;
                        if (null != easingParam) {
                            period = easingParam[0];
                        }
                        delta = elasticEaseInOut(time, period);
                    }
                    break;
                case TweenType.Back_EaseIn:
                    delta = backEaseIn(time);
                    break;
                case TweenType.Back_EaseOut:
                    delta = backEaseOut(time);
                    break;
                case TweenType.Back_EaseInOut:
                    delta = backEaseInOut(time);
                    break;
                case TweenType.Bounce_EaseIn:
                    delta = bounceEaseIn(time);
                    break;
                case TweenType.Bounce_EaseOut:
                    delta = bounceEaseOut(time);
                    break;
                case TweenType.Bounce_EaseInOut:
                    delta = bounceEaseInOut(time);
                    break;
                default:
                    delta = sineEaseInOut(time);
                    break;
            }
            return delta;
        }
        TweenFunc.tweenTo = tweenTo;
    })(TweenFunc = laya.TweenFunc || (laya.TweenFunc = {}));
})(laya || (laya = {}));
//# sourceMappingURL=TweenFunction.js.map