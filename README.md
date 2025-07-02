Great! Let's walk through how to use MongoDB Aggregation to build an HR Dashboard using employee and attendance collections.

We'll cover key metrics like:

Total number of employees

Department-wise employee count

Attendance summary (Present/Absent)

Late comers

Employees with most absences

🏢 Sample Data Model
🧑‍💼 employees collection
json
Copy
Edit
{
  "_id": ObjectId("emp1"),
  "name": "Alice",
  "department": "Engineering",
  "joinDate": "2021-06-01"
}
🕒 attendance collection
json
Copy
Edit
{
  "_id": ObjectId("att1"),
  "employeeId": ObjectId("emp1"),
  "date": "2025-06-30",
  "status": "Present",
  "inTime": "10:05"
}
✅ 1. Total Number of Employees
js
Copy
Edit
db.employees.aggregate([
  { $count: "totalEmployees" }
])
✅ 2. Department-Wise Employee Count
js
Copy
Edit
db.employees.aggregate([
  { $group: { _id: "$department", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])
✅ 3. Attendance Summary (Present/Absent) for a Date
js
Copy
Edit
db.attendance.aggregate([
  { $match: { date: "2025-06-30" } },
  { $group: { _id: "$status", count: { $sum: 1 } } }
])
✅ 4. Late Comers (after 10:00 AM)
js
Copy
Edit
db.attendance.aggregate([
  { $match: { date: "2025-06-30", inTime: { $gt: "10:00" }, status: "Present" } },
  {
    $lookup: {
      from: "employees",
      localField: "employeeId",
      foreignField: "_id",
      as: "employeeInfo"
    }
  },
  { $unwind: "$employeeInfo" },
  { $project: { name: "$employeeInfo.name", inTime: 1 } }
])
✅ 5. Employees with Most Absences
js
Copy
Edit
db.attendance.aggregate([
  { $match: { status: "Absent" } },
  { $group: { _id: "$employeeId", absences: { $sum: 1 } } },
  { $sort: { absences: -1 } },
  {
    $lookup: {
      from: "employees",
      localField: "_id",
      foreignField: "_id",
      as: "employeeInfo"
    }
  },
  { $unwind: "$employeeInfo" },
  { $project: { name: "$employeeInfo.name", absences: 1 } },
  { $limit: 5 }
])
📊 Use Cases for HR Dashboard with MongoDB Aggregation
Metric	Aggregation Used
Total Employees	$count
Headcount by Department	$group, $sort
Daily Attendance Summary	$match, $group
Late Arrival Tracking	$match, $lookup
Top Absentees	$group, $sort, $limit

Would you like this data visualized using React charts (e.g. Recharts or Chart.js) in a dashboard? I can help you build the front-end too.








You said:
above last month attence caluculations


ChatGPT said:
To calculate last month's attendance summaries (e.g., for June 2025) from your attendance collection using MongoDB Aggregation, here's a full solution.

📁 Assumptions
🔸 attendance collection structure:
json
Copy
Edit
{
  "_id": ObjectId("att1"),
  "employeeId": ObjectId("emp1"),
  "date": ISODate("2025-06-15"),
  "status": "Present", // or "Absent" or "Leave"
  "inTime": "09:58"
}
🎯 Goal:
You want to get:

Total present/absent/leave counts per employee in June 2025

Total working days in June

Employee-wise percentage attendance

✅ 1. Per Employee Attendance Summary for Last Month (June 2025)
js
Copy
Edit
db.attendance.aggregate([
  {
    $match: {
      date: {
        $gte: ISODate("2025-06-01"),
        $lte: ISODate("2025-06-30")
      }
    }
  },
  {
    $group: {
      _id: {
        employeeId: "$employeeId",
        status: "$status"
      },
      count: { $sum: 1 }
    }
  },
  {
    $group: {
      _id: "$_id.employeeId",
      attendance: {
        $push: {
          status: "$_id.status",
          count: "$count"
        }
      }
    }
  },
  {
    $lookup: {
      from: "employees",
      localField: "_id",
      foreignField: "_id",
      as: "employeeInfo"
    }
  },
  { $unwind: "$employeeInfo" },
  {
    $project: {
      employeeId: "$_id",
      name: "$employeeInfo.name",
      department: "$employeeInfo.department",
      attendance: 1
    }
  }
])
🧮 2. Optionally: Add Attendance % Calculation (in App Code)
You can post-process the above result in your app like this:

js
Copy
Edit
const workingDays = 22; // or calculated based on date range
const presentDays = attendance.find(a => a.status === "Present")?.count || 0;
const attendancePercent = (presentDays / workingDays) * 100;
📊 Sample Output:
json
Copy
Edit
{
  "name": "Alice",
  "department": "Engineering",
  "attendance": [
    { "status": "Present", "count": 18 },
    { "status": "Absent", "count": 2 },
    { "status": "Leave", "count": 2 }
  ]
}
🛠 Notes:
This query is date-based, dynamic, and useful for monthly reporting.

You can easily replace the hard-coded dates with JavaScript logic:

js
Copy
Edit
const now = new Date();
const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
