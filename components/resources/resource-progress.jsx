/* eslint-disable react/prop-types */
/* eslint-disable import/extensions */
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ResourceProgress({ resource }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{resource.userProgress?.percentage || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${resource.userProgress?.percentage || 0}%` }}
              />
            </div>
          </div>

          <div className="pt-4">
            <h4 className="text-sm font-medium mb-2">Status</h4>
            <select
              className="w-full p-2 border rounded-lg"
              value={resource.userProgress?.status || "Not Started"}
            >
              <option>Not Started</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>

          <div className="pt-4">
            <h4 className="text-sm font-medium mb-2">Time Spent</h4>
            <p className="text-2xl font-bold">
              {resource.userProgress?.timeSpent || 0} hours
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
