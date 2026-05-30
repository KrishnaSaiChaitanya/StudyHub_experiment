import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function renderHtmlPreview(htmlString: string): string {
  if (typeof window === "undefined") {
    return htmlString;
  }
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    
    // Security: Remove any potential script injection elements
    const scripts = doc.querySelectorAll("script, iframe, object, embed");
    scripts.forEach((el) => el.remove());
    
    // Security: Remove event handlers (e.g. onload, onerror, onclick)
    const allElements = doc.getElementsByTagName("*");
    for (let i = 0; i < allElements.length; i++) {
      const el = allElements[i];
      for (let j = el.attributes.length - 1; j >= 0; j--) {
        const attr = el.attributes[j];
        if (attr.name.startsWith("on")) {
          el.removeAttribute(attr.name);
        }
      }
    }
    
    // Replace <img> tags with a dummy image icon/label
    const images = doc.querySelectorAll("img");
    images.forEach((img) => {
      const span = doc.createElement("span");
      span.className = "inline-flex items-center gap-1 text-[10px] font-semibold text-accent bg-accent/10 px-1.5 py-0.5 rounded mx-0.5 border border-accent/25 select-none align-middle";
      span.textContent = "🖼️ Image";
      img.parentNode?.replaceChild(span, img);
    });

    return doc.body.innerHTML;
  } catch (e) {
    return htmlString;
  }
}
