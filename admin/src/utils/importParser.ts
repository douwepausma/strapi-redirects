import csvtojson from 'csvtojson';

export interface RedirectImportType {
  source: string;
  destination: string;
  permanent: boolean;
}

interface ValidationResult extends RedirectImportType {
  status: 'VALID' | 'INVALID';
  reason?: string;
  details: { type: 'NEW' | 'LOOP_DETECTED' | 'DUPLICATE' };
}

// Helper function to detect immediate loops
const isImmediateLoop = (source: string, destination: string): boolean => source === destination;

// Helper function to detect duplicates within the CSV
const findDuplicate = (
  redirects: RedirectImportType[],
  source: string
): RedirectImportType | undefined => redirects.find((r) => r.source === source);

// Helper function to detect indirect loops more accurately
const isIndirectLoop = (
  redirects: RedirectImportType[],
  source: string,
  destination: string,
  origin: string = source,
  checked: Set<string> = new Set()
): boolean => {
  // Prevent infinite recursion by checking if we've already inspected this URL
  if (checked.has(destination)) return false;
  checked.add(destination);

  for (const redirect of redirects) {
    if (redirect.source === destination) {
      // If the "destination" URL redirects back to the origin, a loop is detected
      if (redirect.destination === origin) return true;
      // Recursively check the next link in the chain
      if (isIndirectLoop(redirects, redirect.source, redirect.destination, origin, checked))
        return true;
    }
  }
  return false;
};

const parseAndValidateCSV = async (data: string): Promise<ValidationResult[]> => {
  try {
    const dataRaw = await csvtojson().fromString(data);

    const redirects: RedirectImportType[] = dataRaw.map(
      (item: any): RedirectImportType => ({
        source: item.source,
        destination: item.destination,
        permanent: item.permanent.toLowerCase() === 'true',
      })
    );

    const validationResults: ValidationResult[] = redirects.map((redirect, index, self) => {
      if (isImmediateLoop(redirect.source, redirect.destination)) {
        return {
          ...redirect,
          status: 'INVALID',
          reason: 'Immediate loop detected',
          details: { type: 'LOOP_DETECTED' },
        };
      }

      // Ensure we don't mark the first occurrence as a duplicate
      if (findDuplicate(self.slice(0, index), redirect.source)) {
        return {
          ...redirect,
          status: 'INVALID',
          reason: 'Duplicate redirect',
          details: { type: 'DUPLICATE' },
        };
      }

      // Check for indirect loops without including the current redirect in the check
      if (
        isIndirectLoop(
          self.filter((_, idx) => idx !== index),
          redirect.source,
          redirect.destination
        )
      ) {
        return {
          ...redirect,
          status: 'INVALID',
          reason: 'Indirect loop detected',
          details: { type: 'LOOP_DETECTED' },
        };
      }

      return {
        ...redirect,
        status: 'VALID',
        details: { type: 'NEW' },
      };
    });

    return validationResults;
  } catch (error) {
    console.error('Failed to parse CSV:', error);
    throw new Error('Error parsing and validating CSV data');
  }
};

export { parseAndValidateCSV };
