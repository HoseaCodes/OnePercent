// lib/related-resources.js
export function calculateResourceSimilarity(resource1, resource2) {
  let score = 0;

  // Category match
  if (resource1.category === resource2.category) {
    score += 3;
  }

  // Tags overlap
  const commonTags = resource1.tags.filter((tag) =>
    resource2.tags.includes(tag),
  );
  score += commonTags.length * 2;

  // Difficulty level proximity
  const difficultyLevels = ["Beginner", "Intermediate", "Advanced"];
  const diff1Index = difficultyLevels.indexOf(resource1.difficulty);
  const diff2Index = difficultyLevels.indexOf(resource2.difficulty);
  const diffDifference = Math.abs(diff1Index - diff2Index);
  score += 2 - diffDifference;

  return score;
}

export function findRelatedResources(currentResource, allResources, limit = 5) {
  return allResources
    .filter((resource) => resource._id !== currentResource._id)
    .map((resource) => ({
      ...resource,
      similarityScore: calculateResourceSimilarity(currentResource, resource),
    }))
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);
}
