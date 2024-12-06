/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-shadow */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/extensions */
/* eslint-disable react/prop-types */

import { useState } from "react";
import {
  Plus,
  GripVertical,
  Trash2,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { Dialog, DialogOverlay, DialogContent } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useCreatePath } from "@/hooks/use-paths";

export default function CreatePathModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  const [error, setError] = useState(null);
  const { createPath, isLoading } = useCreatePath();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Technical",
    difficulty: "Beginner",
    estimatedTime: "",
    startDate: "",
    targetDate: "",
    milestones: [
      { title: "", description: "", dueDate: "", order: 0, completed: false },
    ], // Removed status
    resources: {
      books: [],
      "online courses": [],
      "practice materials": [],
    },
    status: "NotStarted", // Changed to match enum
    tags: [],
  });

  // Update handleSubmit to prepare data according to new model
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (!formData.milestones.every((m) => m.title.trim())) {
        setError("All milestone titles are required");
        return;
      }

      // Prepare the data according to the new model
      const currentYear = new Date().getFullYear();
      const monthNames = [...Array(12)].map((_, i) =>
        new Date(2024, i).toLocaleString("default", { month: "long" }),
      );

      // Distribute milestones across quarters and months
      const quarters = Array.from({ length: 4 }, (_, i) => ({
        title: `Q${i + 1}`,
        months: Array.from({ length: 3 }, (_, j) => {
          const monthIndex = i * 3 + j;
          return {
            title: monthNames[monthIndex],
            milestones: [],
            weeks: [],
          };
        }),
      }));

      // Distribute milestones across first quarter's months
      const milestonesPerMonth = Math.ceil(formData.milestones.length / 3);
      formData.milestones.forEach((milestone, index) => {
        const monthIndex = Math.floor(index / milestonesPerMonth);
        if (monthIndex < 3) {
          quarters[0].months[monthIndex].milestones.push({
            title: milestone.title,
            description: milestone.description,
            dueDate: milestone.dueDate,
            order: index,
            completed: false,
            createdAt: new Date(),
          });
        }
      });

      const pathData = {
        ...formData,
        status: "NotStarted",
        progress: 0,
        progressTrend: 0,
        timeSpent: 0,
        years: [
          {
            title: currentYear.toString(),
            quarters,
          },
        ],
        defaultHabits: [
          {
            title: "Code",
            minimumRequirement: "2 hours",
            frequency: "daily",
            type: "technical",
          },
          {
            title: "Read",
            minimumRequirement: "1 paper",
            frequency: "daily",
            type: "learning",
          },
          {
            title: "Document",
            minimumRequirement: "1 entry",
            frequency: "daily",
            type: "documentation",
          },
          // ... add other default habits
        ],
        kpis: [],
        weeklyPlan: {
          week: new Date(),
          tasks: [],
          lastUpdated: new Date(),
        },
      };

      await createPath(pathData);
      onClose();
    } catch (error) {
      setError(error.message || "Failed to create path");
    }
  };

  const addMilestone = () => {
    setFormData((prev) => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        { title: "", description: "", dueDate: "", status: "Not Started" },
      ],
    }));
  };

  const removeMilestone = (index) => {
    if (formData.milestones.length > 1) {
      setFormData((prev) => ({
        ...prev,
        milestones: prev.milestones.filter((_, i) => i !== index),
      }));
    }
  };

  return (
    <Dialog>
      <DialogOverlay onClick={onClose} />
      <DialogContent className="max-w-4xl w-full bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
        {/* Fixed Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Create New Path</h1>
              <p className="text-gray-500">
                Design your custom learning journey
              </p>
            </div>
            <div className="space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? "Creating..." : "Create Path"}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Path Details */}
          <Card>
            <CardHeader>
              <CardTitle>Path Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Path Name
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g., Technical Engineering Mastery"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="Technical">Technical</option>
                      <option value="Creative">Creative</option>
                      <option value="Physical">Physical</option>
                      <option value="Language">Language</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Difficulty
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) =>
                        setFormData({ ...formData, difficulty: e.target.value })
                      }
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Time (hours)
                    </label>
                    <input
                      type="number"
                      value={formData.estimatedTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          estimatedTime: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-lg"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Date
                    </label>
                    <input
                      type="date"
                      value={formData.targetDate}
                      onChange={(e) =>
                        setFormData({ ...formData, targetDate: e.target.value })
                      }
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Milestones */}
          <Card>
            <CardHeader>
              <CardTitle>Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    <GripVertical className="h-5 w-5 text-gray-400" />
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <input
                        type="text"
                        value={milestone.title}
                        onChange={(e) => {
                          const newMilestones = [...formData.milestones];
                          newMilestones[index].title = e.target.value;
                          setFormData({
                            ...formData,
                            milestones: newMilestones,
                          });
                        }}
                        className="p-2 border rounded-lg"
                        placeholder="Milestone name"
                        required
                      />
                      <input
                        type="date"
                        value={milestone.dueDate}
                        onChange={(e) => {
                          const newMilestones = [...formData.milestones];
                          newMilestones[index].dueDate = e.target.value;
                          setFormData({
                            ...formData,
                            milestones: newMilestones,
                          });
                        }}
                        className="p-2 border rounded-lg"
                        required
                      />
                      <select
                        value={milestone.status}
                        onChange={(e) => {
                          const newMilestones = [...formData.milestones];
                          newMilestones[index].status = e.target.value;
                          setFormData({
                            ...formData,
                            milestones: newMilestones,
                          });
                        }}
                        className="p-2 border rounded-lg"
                      >
                        <option>Not Started</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                      </select>
                    </div>
                    {formData.milestones.length > 1 && (
                      <Trash2
                        className="h-5 w-5 text-red-500 cursor-pointer"
                        onClick={() => removeMilestone(index)}
                      />
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMilestone}
                  className="w-full p-4 border border-dashed rounded-lg text-gray-500 hover:bg-gray-50 flex items-center justify-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Milestone</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Learning Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Books", "Online Courses", "Practice Materials"].map(
                  (category) => (
                    <div key={category} className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">{category}</h3>
                      <div className="space-y-2">
                        {formData.resources?.[category.toLowerCase()]?.map(
                          (resource, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <BookOpen className="h-5 w-5 text-blue-500" />
                              <input
                                type="text"
                                value={resource}
                                onChange={(e) => {
                                  const newResources = {
                                    ...formData.resources,
                                  };
                                  newResources[category.toLowerCase()][index] =
                                    e.target.value;
                                  setFormData({
                                    ...formData,
                                    resources: newResources,
                                  });
                                }}
                                className="flex-1 p-2 border rounded-lg"
                                placeholder={`${category} title`}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newResources = {
                                    ...formData.resources,
                                  };
                                  newResources[category.toLowerCase()].splice(
                                    index,
                                    1,
                                  );
                                  setFormData({
                                    ...formData,
                                    resources: newResources,
                                  });
                                }}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          ),
                        )}
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-5 w-5 text-blue-500" />
                          <input
                            type="text"
                            className="flex-1 p-2 border rounded-lg"
                            placeholder={`Add new ${category.toLowerCase()}`}
                            onKeyPress={(e) => {
                              if (e.key === "Enter" && e.target.value.trim()) {
                                const newResources = {
                                  ...formData.resources,
                                  [category.toLowerCase()]: [
                                    ...(formData.resources?.[
                                      category.toLowerCase()
                                    ] || []),
                                    e.target.value.trim(),
                                  ],
                                };
                                setFormData({
                                  ...formData,
                                  resources: newResources,
                                });
                                e.target.value = "";
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.querySelector(
                                `input[placeholder="Add new ${category.toLowerCase()}"]`,
                              );
                              if (input.value.trim()) {
                                const newResources = {
                                  ...formData.resources,
                                  [category.toLowerCase()]: [
                                    ...(formData.resources?.[
                                      category.toLowerCase()
                                    ] || []),
                                    input.value.trim(),
                                  ],
                                };
                                setFormData({
                                  ...formData,
                                  resources: newResources,
                                });
                                input.value = "";
                              }
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Plus className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fixed Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create Path"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
