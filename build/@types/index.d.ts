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
export declare function set_storage(setStorage: "localStorage" | "sessionStorage"): void;
/** The default fallback if a value is neither dark, light, nor system. */
export declare function set_default(defaultTheme: Theme): void;
export {};
