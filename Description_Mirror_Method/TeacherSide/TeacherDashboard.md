

## Teacher Dashboard

Intro: This is the main dashboard page for teachers to manage their assigned classes and students. Teachers can navigate between sub-pages using a sidebar (no header or footer in this section). The data managed here feeds directly to the public HomePage sections. Teachers can use React Router to navigate between sub-pages.

1. General Information Page: This page displays key statistics and student information. It shows:
   - Quick stats: Number of assigned classes, total students, and key metrics.
   - Student list: A searchable section listing all students assigned to the teacher.
   - Student details: Clicking on a student name displays full information including full name, WhatsApp and phone contact buttons for direct communication, age, and other relevant details.
   
   Note: Only admin can add new students to the system; teachers manage existing student assignments.

2. Absence and Attendance Control Page: This page allows teachers to mark and manage student attendance for their classes. It includes:
   - Class selection: A dropdown or list to select the specific class.
   - Date selection: Choose the date for which to mark attendance (current date or historical dates).
   - Student list: Once a class is selected, display all students in that class with a searchable field.
   - Mark attendance: Teachers can set each student's status (present/absent) for the selected date and class.
   - Auto-save or manual submission: Clarify whether attendance data saves automatically or requires explicit submission.
   
   Example: If a teacher has classes C1, C2, and C3, they select C2, search for students, and mark their attendance for that class on a specific date. This data feeds to the HomePage's "Absence and Attendance" section.

3. Weekly Honor Page: This page allows teachers to nominate ideal students for the honor wall. It includes:
   - Student nomination: Select one ideal student per class each week.
   - Status tracking: Display approval status for nominations (admin accept or reject).
   - Weekly reset: Automatically reset nominations at the end of each week.
   - Submission deadline: Teachers should nominate students by a set deadline each week.
   
   The nominated students (once approved by admin) appear on HomePage's "Honor" section with explanations of why they were featured.

4. Lessons Weekly Plan Page: This page allows teachers to set and plan lessons for each class. It includes:
   - Class selection: Choose one class at a time to plan lessons.
   - Course/Subject selection: Select the course or subject being taught.
   - Weekly schedule: Define days and times for lessons in the selected class.
   - Lesson details: Add lesson descriptions, content, or notes for each session.
   - Save and visibility: Clarify whether lesson plans are visible to students/parents on the public side.
   
   Example: If a teacher has classes C1, C2, and C3, they can plan each class's weekly schedule separately, specifying days, times, and lesson topics. This data supports the HomePage's "Available Courses" section.

