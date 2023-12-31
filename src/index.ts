type Theme = "dark" | "light" | "system";
type Storage = "localStorage" | "sessionStorage";

let storage: Storage = "localStorage";
let default_theme: Theme = "system";
let attribute: "class" | "data-theme" = "class";
let color_scheme: boolean = true;
let aborter: undefined | AbortController = undefined;
const subscribers: Map<number, (theme: Theme) => void> = new Map();
let subscribers_length = 0;

const media_query = window.matchMedia("(prefers-color-scheme: dark)");

export function subscribe_to_theme_changes(subscriber: (theme: Theme) => void) {
    const id = subscribers_length++;

    subscribers.set(id, subscriber);

    return () => {
        subscribers.delete(id);
        subscribers_length--;
    };
}

function update(theme: Theme) {
    for (const subscriber of subscribers.values()) {
        subscriber(theme);
    }
}

function set_theme() {
    const html = document.documentElement;
    const class_list = html.classList;
    let stored_theme: undefined | null | string;

    if (aborter) {
        aborter.abort();
        aborter = undefined;
    }

    if (attribute == "class") {
        class_list.remove("dark", "light");
    }

    if (storage == "localStorage") {
        stored_theme = localStorage.getItem("theme");
    } else if (storage == "sessionStorage") {
        stored_theme = sessionStorage.getItem("theme");
    }

    if (stored_theme == null || (stored_theme != "dark" && stored_theme != "light" && stored_theme != "system")) {
        stored_theme = default_theme;
    }

    if (stored_theme == "dark" || stored_theme == "light") {
        if (attribute == "class") {
            class_list.add(stored_theme);
        } else {
            html.setAttribute("data-theme", stored_theme);
        }

        if (color_scheme) {
            html.style.colorScheme = stored_theme;
        }

        update(stored_theme);
    } else {
        if (media_query.matches) {
            if (attribute == "class") {
                class_list.add("dark");
            } else {
                html.setAttribute("data-theme", "dark");
            }
    
            if (color_scheme) {
                html.style.colorScheme = "dark";
            }

            update("light");
        } else {
            if (attribute == "class") {
                class_list.add("light");
            } else {
                html.setAttribute("data-theme", "light");
            }
    
            if (color_scheme) {
                html.style.colorScheme = "light";
            }

            update("dark");
        }
        
        aborter = new AbortController();

        media_query.addEventListener("change", set_theme, { once: true, signal: aborter.signal });
    }
};

/** Changes the theme to either
 * 
 *  - `light`
 *  - `dark`
 *  - `system`
 * 
 *  If an invalid value is provided, defaults to the default you provide or "system".
 */
export function change_theme(theme: Theme) {
    switch(storage) {
        case "localStorage":
            localStorage.setItem("theme", theme);
            break;
        case "sessionStorage":
            sessionStorage.setItem("theme", theme);
            break;
    }

    set_theme();
}

export function set_storage(setStorage: "localStorage" | "sessionStorage") {
    storage = setStorage;
}

/** The default fallback if a value is neither dark, light, nor system. */
export function set_default(defaultTheme: Theme) {
    default_theme = defaultTheme;
}

window.addEventListener("DOMContentLoaded", set_theme);
