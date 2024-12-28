import type { Core } from '@strapi/types';

export default async ({ strapi }: { strapi: Core.Strapi }) => {
  // Store active subscriptions to manage them manually
  // let activeSubscriptions: Array<{ uid: string; unsubscribe: () => void }> = [];

  /**
   * Fetch the selected models with enabled lifecycle hooks.
   */
  // const getSelectedModels = async () => {
  //   const settings = await strapi.plugin('redirects').service('settingsService').getSettings();

  //   // Return UIDs of enabled models with selected fields
  //   return Object.entries(settings)
  //     .filter(([_, value]) => value.enabled) // Only enabled models
  //     .map(([uid, { field }]) => ({ uid, field }));
  // };

  /**
   * Clear existing subscriptions.
   */
  // const clearSubscriptions = () => {
  //   activeSubscriptions.forEach(({ unsubscribe }) => unsubscribe());
  //   activeSubscriptions = [];
  // };

  /**
   * Initialize lifecycle subscriptions dynamically.
   */
  // const initializeLifecycleSubscription = async () => {
  //   // Clear any existing subscriptions
  //   clearSubscriptions();

  //   const selectedModels = await getSelectedModels();

  //   // Subscribe to lifecycle events for each selected model
  //   selectedModels.forEach(({ uid, field }) => {
  //     // Subscribe to Document Service lifecycle hooks
  //     const unsubscribe = strapi.db.lifecycles.subscribe({
  //       models: [uid], // Specify the model
  //       async beforeUpdate(event) {
  //         const { params, result } = event;

  //         // Skip if no field is selected
  //         if (!field) return;

  //         const oldValue = result[field];
  //         const newValue = params.data[field];

  //         if (oldValue !== newValue) {
  //           console.log(
  //             `Field "${field}" changed for ${uid}. Old value: "${oldValue}", New value: "${newValue}"`
  //           );

  //           // Notify or trigger redirect creation
  //           await strapi
  //             .plugin('redirects')
  //             .service('redirectService')
  //             .handleFieldChange(uid, field, oldValue, newValue);
  //         }
  //       },
  //       async beforeDelete(event) {
  //         const { model, params } = event;

  //         console.log(`Content type deleted: ${model.uid}`);
  //         // Handle redirect creation logic when content type is deleted
  //         await strapi
  //           .plugin('redirects')
  //           .service('redirectService')
  //           .handleContentDeletion(model.uid, params.where?.id);
  //       },
  //     });

  //     // Store active subscription
  //     activeSubscriptions.push({ uid, unsubscribe });
  //   });

  //   console.log(
  //     `Lifecycle subscriptions initialized for models: ${selectedModels.map((m) => m.uid).join(', ')}`
  //   );
  // };

  /**
   * Poll for changes in settings and reinitialize lifecycle subscriptions if needed.
   */
  // const pollForSettingsChanges = async () => {
  //   let lastSettingsHash = null;

  //   setInterval(async () => {
  //     try {
  //       const settings = await strapi.plugin('redirects').service('settingsService').getSettings();
  //       const currentHash = JSON.stringify(settings);

  //       if (lastSettingsHash !== currentHash) {
  //         console.log('Settings changed. Reinitializing lifecycle subscriptions...');
  //         lastSettingsHash = currentHash;
  //         await initializeLifecycleSubscription();
  //       }
  //     } catch (error) {
  //       console.error('Error while polling for settings changes:', error);
  //     }
  //   }, 10000); // Check every 10 seconds
  // };

  // Initialize lifecycle listeners on bootstrap
  // await initializeLifecycleSubscription();

  // Start polling for settings changes
  // pollForSettingsChanges();
};
