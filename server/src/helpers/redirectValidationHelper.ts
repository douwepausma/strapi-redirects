interface RedirectData {
  source: string;
  destination: string;
  permanent: boolean;
}

interface ValidationResult {
  ok: boolean;
  errorMessage?: string;
  details?: any;
}

/**
 * Query redirects by URL with optional ID exclusion.
 * @param url The URL to query redirects for.
 * @param excludeId Optional ID to exclude from the results.
 * @returns The query results.
 */
async function findRedirectsBySource(url: string, excludeId?: string): Promise<any[]> {
  const filters: any = { source: url };
  if (excludeId) {
    filters.documentId = { $ne: excludeId };
  }

  return strapi.documents('plugin::redirects.redirect').findMany({ filters });
}

/**
 * Internal function to check for URL loops recursively.
 * Only exposed via `isUrlLooping`.
 *
 * @param originalSourceUrl The original "source" URL to check for loops.
 * @param destinationUrl The "destination" URL to check against the original "source" URL.
 * @param excludeId Optional ID of the redirect being validated, to exclude from checks.
 * @param checkedUrls A set of URLs that have already been checked.
 * @returns Whether a loop has been detected.
 */
async function checkUrlLooping(
  originalSourceUrl: string,
  destinationUrl: string,
  excludeId?: string,
  checkedUrls = new Set<string>()
): Promise<boolean> {
  // Prevent a loop where source and destination are the same
  if (originalSourceUrl === destinationUrl) {
    return true; // This would cause a loop, so return true to indicate looping
  }

  // Avoid re-checking URLs we've already verified
  if (checkedUrls.has(destinationUrl)) return false;

  // Add this destination URL to the checked set
  checkedUrls.add(destinationUrl);

  const results = await findRedirectsBySource(destinationUrl, excludeId);

  // Recursively check if any of the found redirects loop back to the original source
  for (let result of results) {
    if (
      result.destination === originalSourceUrl ||
      (await checkUrlLooping(originalSourceUrl, result.destination, excludeId, checkedUrls))
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Check if a URL creates a loop back to the source.
 * This is the exposed function for checking URL loops.
 *
 * @param sourceUrl The original "source" URL to check for loops.
 * @param destinationUrl The "destination" URL to check.
 * @param excludeId Optional ID of the redirect for updating.
 * @returns Whether a loop has been detected.
 */
async function isUrlLooping(
  sourceUrl: string,
  destinationUrl: string,
  excludeId?: string
): Promise<boolean> {
  // Call the internal function with an empty set to initiate loop checking
  return checkUrlLooping(sourceUrl, destinationUrl, excludeId);
}

/**
 * Validates a redirect by checking for duplicates and loops.
 *
 * @param redirectData The redirect data.
 * @param id Optional ID of the redirect for update.
 * @returns The validation result.
 */
export async function validateRedirect(
  redirectData: RedirectData,
  id: string | undefined = undefined
): Promise<ValidationResult> {
  const { source, destination } = redirectData;

  // Prevent creating a redirect where source and destination are the same
  if (source === destination) {
    return {
      ok: false,
      errorMessage: "Invalid redirect: The 'Source' and 'Destination' cannot be the same.",
      details: { type: 'LOOP' },
    };
  }

  // Check for duplicate redirects
  const duplicates = await findRedirectsBySource(source, id);
  const hasDuplicate = duplicates.length > 0;

  // Check for URL loop
  const hasLoop = await checkUrlLooping(source, destination, id);

  if (hasDuplicate) {
    return {
      ok: false,
      errorMessage: "Duplicate redirect: A redirect with the same 'Source' already exists.",
      details: { type: 'DUPLICATE' },
    };
  }

  if (hasLoop) {
    return {
      ok: false,
      errorMessage:
        "Redirect loop detected: The 'Destination' creates a loop back to the 'Source'.",
      details: { type: 'LOOP' },
    };
  }

  return { ok: true };
}
