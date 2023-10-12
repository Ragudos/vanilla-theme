type Theme = "dark" | "light" | "system";
/** Changes the theme to either
 *
 *  - `light`
 *  - `dark`
 *  - `system`
 *
 *  If an invalid value is provided, defaults to the default you provide or "system".
 */
export declare function change_theme(theme: Theme): void;
export {};
