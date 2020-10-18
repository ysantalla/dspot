import {
  animate,
  group,
  query,
  style,
  transition,
  trigger,
  stagger,
  state
} from '@angular/animations';

export const ANIMATE_ON_ROUTE_ENTER = 'route-enter-staggered';

export const RouterTransition = trigger('routerTransition', [
  transition('* <=> *', [
    query(':enter, :leave', style({ position: 'fixed', width: '100%' }), {
      optional: true
    }),
    query(':enter .' + ANIMATE_ON_ROUTE_ENTER, style({ opacity: 0 }), {
      optional: true
    }),
    group([
      query(
        ':enter',
        [
          style({ transform: 'translateY(-3%)', opacity: 0 }),
          animate(
            '0.5s 0.5s ease-in-out',
            style({ transform: 'translateY(0%)', opacity: 1 })
          )
        ],
        { optional: true }
      ),
      query(
        ':leave',
        [
          style({ transform: 'translateY(0%)', opacity: 1 }),
          animate(
            '0.2s ease-in-out',
            style({ transform: 'translateY(-3%)', opacity: 0 })
          )
        ],
        { optional: true }
      )
    ]),
    query(
      ':enter .' + ANIMATE_ON_ROUTE_ENTER,
      stagger(100, [
        style({ transform: 'translateY(15%)', opacity: 0 }),
        animate(
          '0.5s ease-in-out',
          style({ transform: 'translateY(0%)', opacity: 1 })
        )
      ]),
      { optional: true }
    )
  ])
]);


export const FadeInOut = trigger('FadeInOut', [
  state('void', style({
    opacity: 0
  })),
  transition('void <=> *', animate(1000)),
]);


export const EnterLeft = trigger('EnterLeft', [
  state('flyIn', style({ transform: 'translateX(0)' })),
  transition(':enter', [
    style({ transform: 'translateX(-350%)' }),
    animate('0.6s 600ms ease-in')
  ])
]);

export const EnterRight = trigger('EnterRight', [
  state('flyIn', style({ transform: 'translateX(0)' })),
  transition(':enter', [
    style({ transform: 'translateX(350%)' }),
    animate('0.6s 400ms ease-in')
  ])
]);
