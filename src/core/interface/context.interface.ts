// import { Scenes } from 'telegraf';

// import { Context as TelegrafContext } from 'telegraf';

// // eslint-disable-next-line @typescript-eslint/no-empty-interface
// export interface SceneContext extends Scenes.SceneContext {}

// export interface Context extends TelegrafContext {
//     scene: any;
    
//     match: RegExpMatchArray;
//   }
  



import { Scenes } from 'telegraf';
import { Context as TelegrafContext } from 'telegraf';

// Extend SceneContext to include WizardContext for wizards
export interface SceneContext extends Scenes.WizardContext {}

// Extend Telegraf Context to include wizard and match
export interface Context extends TelegrafContext {
    scene: Scenes.SceneContextScene<SceneContext>; // Support for wizard scenes
    wizard: Scenes.WizardContextWizard<SceneContext>; // Support for wizard context
    match: RegExpMatchArray;
}
