import slugify from 'slugify';

const FRAGMENT_REGEX = /\[#(?<slug>(\w|-|_)*)\]/g;

function getSlugFromChild(child:string) :string | null {
    // Check if the fragment contains the expected pattern
    const startIndex = child.indexOf("[#");
    const endIndex = child.indexOf("]");
    
    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex + 2) {
        // Extract the substring containing the slug
        const slugSubstring = child.substring(startIndex + 2, endIndex);
        // Split the slug substring if necessary
        const slug = slugSubstring.trim(); // Trim whitespace
        
        // Check if the extracted slug is valid
        if (slug.length > 0) {
            return slug;
        }
    }
    
    return null; // Return null if the pattern is not found or the extracted slug is empty
};

export default function slugifyMarkdownHeadline(
  markdownChildren: string | any[],
): string {
  if (!markdownChildren) return '';
  if (typeof markdownChildren === 'string')
    return slugify(markdownChildren, { lower: true, trim: true });
  const metaSlug = markdownChildren.reduce((acc, child) => {
    if (acc) return acc;
    if (typeof child !== 'string') return null;
    const fragment = getSlugFromChild(child);
    if (!fragment) return null;
    const slug = fragment;
    return slug || null;
  }, null);
  if (metaSlug) return metaSlug;

  const joinedChildren = markdownChildren
    .filter((child) => typeof child === 'string')
    .map((string) => string.replace(FRAGMENT_REGEX, ''))
    .join(' ');
  const slug = slugify(joinedChildren, { lower: true, trim: true });
  return slug;
}
