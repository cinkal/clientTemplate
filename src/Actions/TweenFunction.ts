module laya {

    const M_PI_X_2 = Math.PI * 2.0;

    export namespace TweenFunc {
        export enum TweenType
        {
            CUSTOM_EASING = -1,
            
            Linear,
            
            Sine_EaseIn,
            Sine_EaseOut,
            Sine_EaseInOut,
            
            
            Quad_EaseIn,
            Quad_EaseOut,
            Quad_EaseInOut,
            
            Cubic_EaseIn,
            Cubic_EaseOut,
            Cubic_EaseInOut,
            
            Quart_EaseIn,
            Quart_EaseOut,
            Quart_EaseInOut,
            
            Quint_EaseIn,
            Quint_EaseOut,
            Quint_EaseInOut,
            
            Expo_EaseIn,
            Expo_EaseOut,
            Expo_EaseInOut,
            
            Circ_EaseIn,
            Circ_EaseOut,
            Circ_EaseInOut,
            
            Elastic_EaseIn,
            Elastic_EaseOut,
            Elastic_EaseInOut,
            
            Back_EaseIn,
            Back_EaseOut,
            Back_EaseInOut,
            
            Bounce_EaseIn,
            Bounce_EaseOut,
            Bounce_EaseInOut,
            
            TWEEN_EASING_MAX = 10000
        }; 

        export function easeIn(time:number, rate:number) : number {
            return Math.pow(time, rate);
        }

        export function easeOut(time:number, rate:number) : number {
            return Math.pow(time, 1 / rate);
        }

        export function easeInOut(time:number, rate:number) : number {
            time *= 2;
            if (time < 1)
                return 0.5 * Math.pow(time, rate);
            else
                return (1.0 - 0.5 * Math.pow(2 - time, rate));
        }

        export function bezieratFunction(a:number, b:number, c:number, d:number, t:number) : number {
            return (Math.pow(1-t,3) * a + 3 * t * (Math.pow(1-t,2)) * b + 3 * Math.pow(t,2) * (1-t) * c + Math.pow(t,3) * d);
        }

        export function quadraticIn(time:number) : number {
            return Math.pow(time,2);
        }

        export function quadraticOut(time:number) : number {
            return -time * (time - 2);
        }

        export function quadraticInOut(time:number) : number {
            let resultTime = time;
            time = time * 2;
            if (time < 1)
            {
                resultTime = time * time * 0.5;
            }
            else
            {
                --time;
                resultTime = -0.5 * (time * (time - 2) - 1);
            }
            return resultTime;
        }

        export function linear(time:number) : number {
            return time;
        }

        export function sineEaseIn(time:number) : number {
            return -1 * Math.cos(time * M_PI_X_2) + 1;
        }

        export function sineEaseOut(time:number) : number {
            return Math.sin(time * M_PI_X_2);
        }

        export function sineEaseInOut(time:number) : number {
            return -0.5 * (Math.cos(Math.PI * time) - 1);
        }

        export function quadEaseIn(time:number) : number {
            return time * time;
        }

        export function quadEaseOut(time:number) : number {
            return -1 * time * (time - 2);
        }

        export function quadEaseInOut(time:number) : number {
            time = time * 2;
            if(time < 1) return 0.5 * time * time;

            --time;
            return -0.5 * (time * (time - 2) - 1);
        }

        export function cubicEaseIn(time:number) : number {
            return time * time * time;
        }

        export function cubicEaseOut(time:number) : number {
            time = -1;
            return (time * time * time + 1);
        }

        export function cubicEaseInOut(time:number) : number {
            time = time * 2;
            if(time < 1) return 0.5 * time * time * time;

            time -= 2;
            return 0.5 * (time * time * time + 2);
        }

        export function quartEaseIn(time:number) : number {
            return time * time * time * time;
        }

        export function quartEaseOut(time:number) : number {
            time = -1;
            return -(time * time * time * time - 1);
        }

        export function quartEaseInOut(time:number) : number {
            time = time * 2;
            if(time < 1) return 0.5 * time * time * time * time;
            time -= 2;
            return -0.5 *  (time * time * time * time - 2);
        }

        export function quintEaseIn(time:number) : number {
             return time * time * time * time * time;
        }

        export function quintEaseOut(time:number) : number {
            time -= 1;
            return (time * time * time * time * time + 1);
        }

        export function quintEaseInOut(time:number) : number {
            time = time * 2;
            if (time < 1)
                return 0.5 * time * time * time * time * time;
            time -= 2;
            return 0.5 * (time * time * time * time * time + 2);
        }

        // Expo Ease
        export function  expoEaseIn(time:number) : number {
            return time == 0 ? 0 : Math.pow(2, 10 * (time/1 - 1)) - 1 * 0.001;
        }

        export function expoEaseOut(time:number) : number {
            return time == 1 ? 1 : (-Math.pow(2, -10 * time / 1) + 1);
        }
        
        export function expoEaseInOut(time:number) : number {
            if(time == 0 || time == 1) 
                return time;
            
            if (time < 0.5)
                return 0.5 * Math.pow(2, 10 * (time * 2 - 1));

            return 0.5 * (-Math.pow(2, -10 * (time * 2 - 1)) + 2);
        }

        // Circ Ease
        export function circEaseIn(time:number) : number {
            return -1 * (Math.sqrt(1 - time * time) - 1);
        }

        export function circEaseOut(time:number) : number {
            time = time - 1;
            return Math.sqrt(1 - time * time);
        }

        export function circEaseInOut(time:number) : number {
            time = time * 2;
            if (time < 1)
                return -0.5 * (Math.sqrt(1 - time * time) - 1);
            time -= 2;
            return 0.5 * (Math.sqrt(1 - time * time) + 1);
        }

        // Elastic Ease
        export function elasticEaseIn(time:number, period:number) : number {
            let newT = 0;
            if (time == 0 || time == 1)
            {
                newT = time;
            }
            else
            {
                let s = period / 4;
                time = time - 1;
                newT = -Math.pow(2, 10 * time) * Math.sin((time - s) * M_PI_X_2 / period);
            }

            return newT;
        }

        export function elasticEaseOut(time:number, period:number) : number {
            let newT = 0;
            if (time == 0 || time == 1)
            {
                newT = time;
            }
            else
            {
                let s = period / 4;
                newT = Math.pow(2, -10 * time) * Math.sin((time - s) * M_PI_X_2 / period) + 1;
            }

            return newT;
        }

        export function elasticEaseInOut(time:number, period:number) : number {
            let newT = 0;
            if (time == 0 || time == 1)
            {
                newT = time;
            }
            else
            {
                time = time * 2;
                if (! period)
                {
                    period = 0.3 * 1.5;
                }

                let s = period / 4;

                time = time - 1;
                if (time < 0)
                {
                    newT = -0.5 * Math.pow(2, 10 * time) * Math.sin((time -s) * M_PI_X_2 / period);
                }
                else
                {
                    newT = Math.pow(2, -10 * time) * Math.sin((time - s) * M_PI_X_2 / period) * 0.5 + 1;
                }
            }
            return newT;
        }

        // Back Ease
        export function backEaseIn(time:number) : number {
            let overshoot = 1.70158;
            return time * time * ((overshoot + 1) * time - overshoot);
        }

        export function backEaseOut(time:number) : number {
            let overshoot = 1.70158;

            time = time - 1;
            return time * time * ((overshoot + 1) * time + overshoot) + 1;
        }
    
        export function backEaseInOut(time:number) : number {
            let overshoot = 1.70158 * 1.525;

            time = time * 2;
            if (time < 1)
            {
                return (time * time * ((overshoot + 1) * time - overshoot)) / 2;
            }
            else
            {
                time = time - 2;
                return (time * time * ((overshoot + 1) * time + overshoot)) / 2 + 1;
            }
        }

        // Bounce Ease
        export function bounceTime(time:number) : number {
            if (time < 1 / 2.75)
            {
                return 7.5625 * time * time;
            }
            else if (time < 2 / 2.75)
            {
                time -= 1.5 / 2.75;
                return 7.5625 * time * time + 0.75;
            }
            else if(time < 2.5 / 2.75)
            {
                time -= 2.25 / 2.75;
                return 7.5625 * time * time + 0.9375;
            }

            time -= 2.625 / 2.75;
            return 7.5625 * time * time + 0.984375;
        }

        export function bounceEaseIn(time:number) : number
        {
            return 1 - bounceTime(1 - time);
        }

        export function bounceEaseOut(time:number)
        {
            return bounceTime(time);
        }

        export function bounceEaseInOut(time:number) : number
        {
            let newT = 0;
            if (time < 0.5)
            {
                time = time * 2;
                newT = (1 - bounceTime(1 - time)) * 0.5;
            }
            else
            {
                newT = bounceTime(time * 2 - 1) * 0.5 + 0.5;
            }

            return newT;
        }

        // Custom Ease
        export function customEase(time:number, easingParam:number[]) : number
        {
            if (easingParam)
            {
                let tt = 1 - time;
                return easingParam[1]*tt*tt*tt + 3*easingParam[3]*time*tt*tt + 3*easingParam[5]*time*time*tt + easingParam[7]*time*time*time;
            }
            return time;
        }

        export function tweenTo(time:number, type:TweenType, easingParam:number[]) : number {
            let delta = 0;
            switch(type) {
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
                    let period = 0.3;
                    if (null != easingParam) {
                        period = easingParam[0];
                    }
                    delta = elasticEaseIn(time, period);
                }
                    break;
                case TweenType.Elastic_EaseOut:
                {
                    let period = 0.3;
                    if (null != easingParam) {
                        period = easingParam[0];
                    }
                    delta = elasticEaseOut(time, period);
                }
                    break;
                case TweenType.Elastic_EaseInOut:
                {
                    let period = 0.3;
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

    }
}