import { AnimationController, Animation } from '@ionic/angular';

export const customAnimation = (_: HTMLElement, opts: any): Animation => {
  const animationCtrl = new AnimationController();
  const rootTransition = animationCtrl.create().duration(200);

  const enterTransition = animationCtrl.create().addElement(opts.enteringEl);
  const exitTransition = animationCtrl.create().addElement(opts.leavingEl);

  if (opts.direction === 'forward') {
    exitTransition.keyframes([
      { offset: 0, opacity: '1' },
      { offset: 1, opacity: '1' },
    ]);
    enterTransition.keyframes([
      { offset: 0, opacity: '0', transform: 'scale(0)' },
      { offset: 1, opacity: '1', transform: 'scale(1)' },
    ]);
  } else {
    enterTransition.keyframes([
      { offset: 0, opacity: '1' },
      { offset: 1, opacity: '1' },
    ]);
    exitTransition.keyframes([
      { offset: 0, opacity: '1', transform: 'scale(1)' },
      { offset: 1, opacity: '0', transform: 'scale(0)' },
    ]);
  }
  return rootTransition.addAnimation([enterTransition, exitTransition]);
};
