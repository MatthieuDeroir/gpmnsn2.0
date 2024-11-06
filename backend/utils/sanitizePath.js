import path from "path";

/**
 * Sanitizes and validates the input path to prevent path injection.
 *
 * @param {string} inputPath - The input path to sanitize.
 * @returns {string} The sanitized and validated path.
 * @throws {Error} If the path is invalid or contains malicious sequences.
 */
function sanitizePath(inputPath) {
    // Normalize the path to resolve any '..' sequences
    const normalizedPath = path.normalize(inputPath);

    // Define the base directory
    const baseDir = path.resolve('logs');

    // Resolve the full path
    const fullPath = path.resolve(baseDir, normalizedPath);

    // Ensure the full path is within the base directory
    if (!fullPath.startsWith(baseDir)) {
        throw new Error('Invalid path: Directory traversal detected');
    }

    // Check for allowed characters (e.g., alphanumeric, hyphens, underscores, and periods)
    const allowedPattern = /^[a-zA-Z0-9_\-./]+$/;
    if (!allowedPattern.test(normalizedPath)) {
        throw new Error('Invalid path: Contains disallowed characters');
    }

    return fullPath;
}

module.exports = sanitizePath;