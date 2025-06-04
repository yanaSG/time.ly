import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useNotebooks } from '../../../providers/NotebookProvider';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { useNotebookContent } from '../../../providers/NotebookContentProvider';
import { useBooks } from '../../../providers/BookProvider';

const Dashboard: React.FC = () => {
  const { getNotebookById } = useNotebooks();
  const { currentContent, getNotebookContent } = useNotebookContent();
  const { titles, getBookTitles } = useBooks();
  const { user, updatePostItNote, updateUserActivity } = useAuth();
  const navigate = useNavigate();

  const [scheduleContent, setScheduleContent] = useState<string>('');
  const [isEditingSchedule, setIsEditingSchedule] = useState<boolean>(false);
  const [_, setIsScheduleSaving] = useState(false);

  const [activeTime, setActiveTime] = useState(0); // Time in seconds
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    if (user?.post_it_note?.text_content) {
      setScheduleContent(user.post_it_note.text_content);
    } else {
      setScheduleContent(''); // Clear if no note exists
    }
  }, [user?.post_it_note]);

  useEffect(() => {
    const INACTIVITY_THRESHOLD = 60 * 1000; // 1 minute of inactivity to pause tracking
    const REPORT_INTERVAL = 5 * 60 * 1000; // Report every 5 minutes

    const trackActivity = () => {
      const now = Date.now();
      const elapsed = now - lastActivity;

      if (elapsed < INACTIVITY_THRESHOLD) {
        setActiveTime(prev => prev + (elapsed / 1000)); // Add seconds
      }
      setLastActivity(now);
    };

    const sendActivityReport = async () => {
      if (activeTime > 0 && user) {
        const today = new Date().toISOString().split('T')[0];
        const durationMinutes = Math.round(activeTime / 60);
        if (durationMinutes > 0) {
          await updateUserActivity(today, durationMinutes);
          setActiveTime(0); // Reset after reporting
        }
      }
    };

    // Event listeners for user activity
    const activityEvents = ['mousemove', 'keydown', 'scroll', 'click'];
    activityEvents.forEach(event => window.addEventListener(event, trackActivity));

    // Set up interval to send activity report
    const reportIntervalId = setInterval(sendActivityReport, REPORT_INTERVAL);

    // Cleanup
    return () => {
      activityEvents.forEach(event => window.removeEventListener(event, trackActivity));
      clearInterval(reportIntervalId);
      // On component unmount, send any remaining active time
      if (activeTime > 0 && user) {
        const today = new Date().toISOString().split('T')[0];
        const durationMinutes = Math.round(activeTime / 60);
        if (durationMinutes > 0) {
          updateUserActivity(today, durationMinutes);
        }
      }
    };
  }, [activeTime, lastActivity, user, updateUserActivity]); // Dependencies

  // Debounced function to save post-it note
  const debouncedSaveSchedule = useCallback( // Renamed from debouncedSavePostIt
    debounce(async (content: string) => {
      if (!user) return; // Only save if user is logged in
      setIsScheduleSaving(true); // Renamed state
      try {
        await updatePostItNote(content); // Use the existing updatePostItNote function
        console.log('Schedule saved!');
      } catch (error) {
        console.error('Failed to save schedule:', error);
      } finally {
        setIsScheduleSaving(false); // Renamed state
      }
    }, 1000), // Save after 1 second of no typing
    [user, updatePostItNote]
  );

  const handleScheduleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => { // Renamed from handlePostItChange
    const content = e.target.value;
    setScheduleContent(content);
    debouncedSaveSchedule(content);
  };

  const handleSaveSchedule = () => {
    // Manually trigger save for immediate feedback on button click, then exit edit mode
    debouncedSaveSchedule.cancel(); // Cancel any pending debounced saves
    debouncedSaveSchedule(scheduleContent); // Trigger an immediate save
    setIsEditingSchedule(false);
  };

  // Prepare heatmap data for display
  // Inside Dashboard.tsx
  const getHeatmapDisplayData = (heatmapData: { [key: string]: number } | undefined) => {
    if (!heatmapData) return [];

    const today = new Date();
    const dates: string[] = [];
    for (let i = 6; i >= 0; i--) { // Last 7 days
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      dates.push(d.toISOString().split('T')[0]); //YYYY-MM-DD
    }

    const displayData: number[][] = Array(7).fill(0).map(() => Array(5).fill(0));

    dates.forEach((dateStr, dayIndex) => {
      const totalMinutes = heatmapData[dateStr] || 0;
      let activityLevel = 0;

      // Define your activity level thresholds in minutes
      if (totalMinutes > 0 && totalMinutes <= 5) { // 1-5 minutes
        activityLevel = 1;
      } else if (totalMinutes > 5 && totalMinutes <= 15) { // 6-15 minutes
        activityLevel = 2;
      } else if (totalMinutes > 15 && totalMinutes <= 30) { // 16-30 minutes
        activityLevel = 3;
      } else if (totalMinutes > 30) { // More than 30 minutes
        activityLevel = 4;
      }

      if (activityLevel > 0) {
        // Mark the corresponding activity level (0-indexed, so level-1)
        displayData[dayIndex][activityLevel - 1] = 1;
      }
    });
    return displayData;
  };

  const heatmapDisplayData = getHeatmapDisplayData(user?.activity_heatmap);

  const handleNotebookClick = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: number) => {
    e.preventDefault();

    try {
      const notebook = await getNotebookById(id);
      console.log('Selected notebook:', notebook);
      if (notebook) {
        await getNotebookContent(notebook.id);
        await getBookTitles(notebook.id);
        console.log('Notebooks: FETCHED TITLES: ', titles);
        console.log('Notebools: FETCHED CONTENT: ', currentContent);
        console.log('Navigating to note with notebook ID:', notebook.id);
        navigate('/note');
      } else {
        alert('Notebook not found');
      }
    } catch (error) {
      console.error('Error fetching notebook:', error);
      alert('Failed to fetch notebook');
    }
  };

  const getPinnedNotebooks = () => {
    if (!user || !user.pinned_notebooks) return [];
    return [...user.pinned_notebooks].sort((a, b) => a.order - b.order);
  };

  const pinnedNotebooks = getPinnedNotebooks();

  return (
    // Main container for the dashboard.
    // min-h-screen ensures it takes at least the full viewport height.
    // flex-col ensures content stacks vertically.
    // p-4 for overall padding, adjusted on larger screens.
    <div className="relative flex flex-col items-center max-h-screen w-full h-full">

      {/* Main content area - centered and responsive with max-width.
          Uses flex-col to stack rows, and gap-6 for spacing between them.
          Removed grid-rows as flex-col is more flexible for responsive stacking. */}
      <div className="relative z-10 w-full h-full mx-auto flex flex-col gap-6 overflow-y-auto">

        {/* Upper Row: ID Card, Schedule, Streak, Heatmap.
            Uses flex-wrap to allow items to wrap to the next line on smaller screens.
            justify-center to center items when they wrap.
            gap-4 for spacing between items, adjusted for different screen sizes.
            min-h-[400px] to ensure a minimum height for this section on smaller screens. */}
        <div className="flex flex-wrap justify-center items-stretch gap-4 sm:gap-6 md:gap-8 min-h-[300px] px-7 pt-7">

          {/* ID Card - Responsive width: full on small, takes up half on medium, and grows on large. */}
          <div className="bg-white w-full md:w-[calc(60%-1rem)] lg:w-[calc(40%-1rem)] xl:w-[calc(40%-1rem)] flex-grow rounded-3xl border border-gray-300 flex flex-col shadow-lg items-center justify-start transform transition-transform duration-300 hover:scale-105 p-4">
            {/* Decorative circle element */}
            <div className="bg-[#dddbd6] pt-2 pb-2 px-10 pr-10 rounded-full mb-4 shadow-inner shadow-gray-500"></div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
              {/* User image with a fallback placeholder. Sizes adjusted for responsiveness. */}
              <img
                src={user?.image || "https://placehold.co/180x180/E0F2F7/263438?text=User"}
                alt="user"
                className="h-20 w-20 sm:h-24 sm:w-24 md:h-34 md:w-34 lg:h-35 lg:w-35 rounded-lg shadow-lg object-cover mb-2 sm:mb-0 sm:mr-4"
              />
              {/* User details. Responsive text and layout. */}
              <div className="flex flex-col text-gray-700 text-center sm:text-left text-sm md:text-base w-full">
                <div className="grid grid-cols-1 gap-1 sm:gap-2">
                  <div>
                    <p className="font-bold">Name:</p>
                    <p className="truncate">
                      {user
                        ? `${user.fname || ''} ${user.lname || ''}`.length > 34
                          ? `${`${user.fname || ''} ${user.lname || ''}`.slice(0, 34)}...`
                          : `${user.fname || ''} ${user.lname || ''}`
                        : ''}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold">Course:</p>
                    <p className="truncate">
                      {user?.course && user.course.length > 34
                        ? `${user.course.slice(0, 34)}...`
                        : user?.course || ''}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold">School:</p>
                    <p className="truncate">
                      {user?.school && user.school.length > 34
                        ? `${user.school.slice(0, 34)}...`
                        : user?.school || ''}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold">Likes:</p>
                    <p className="truncate">
                      {user?.likes && user.likes.length > 34
                        ? `${user.likes.slice(0, 34)}...`
                        : user?.likes || ''}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold">Bio:</p>
                    <p className="truncate">
                      {user?.bio && user.bio.length > 34
                        ? `${user.bio.slice(0, 34)}...`
                        : user?.bio || ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule (Post-it Note) - Responsive width: full on small, takes up half on medium, and grows on large. */}
          <div className="relative bg-yellow-200 w-full md:w-[calc(40%-1rem)] lg:w-[calc(25%-1rem)] xl:w-[calc(25%-1rem)] flex-grow rounded-lg shadow-lg transform -rotate-2 transition-transform duration-300 hover:scale-105 p-4 sm:p-6 flex flex-col items-center justify-between border border-yellow-300">
            <p className="font-bold text-lg mb-3 text-gray-800">Schedule</p>
            {/* Simple decorative tape element */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-gray-400 rounded-b-full opacity-70"></div>

            {isEditingSchedule ? (
              // Editable textarea for schedule. flex-grow ensures it fills available height.
              <div className="flex flex-col w-full h-full">
                <textarea
                  className="flex-grow p-2 sm:p-3 bg-yellow-100 rounded-md text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  value={scheduleContent}
                  onChange={(e) => setScheduleContent(e.target.value)}
                />
                <button
                  onClick={handleSaveSchedule}
                  className="mt-3 bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-2 rounded-md text-md font-semibold shadow transition cursor-pointer"
                >
                  Save
                </button>
              </div>
            ) : (
              // Display mode for schedule. flex-grow ensures it fills available height.
              <div className="flex flex-col items-center w-full h-full">
                <ul className="text-sm text-gray-700 list-none p-0 flex flex-col items-center justify-center h-full">
                  {scheduleContent.split('\n').map((line, index) => (
                    <li key={index} className="bg-yellow-100 rounded-full px-3 py-1 mb-1 text-center last:mb-0">
                      {line}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setIsEditingSchedule(true)}
                  className="mt-3 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-md font-semibold transition cursor-pointer"
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* Container for Streak and Heatmap to keep them grouped.
              Stacks on small screens, side-by-side on medium, and then stacks again on large to fit the layout. */}
          <div className="flex flex-col gap-4 sm:gap-6 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1rem)] xl:w-[calc(25%-1rem)] flex-grow">
            {/* Streak display - Responsive width: full on small, and grows on large. */}
            <div className="bg-white w-full rounded-3xl border border-gray-300 shadow-lg transform transition-transform duration-300 hover:scale-105 p-4 flex flex-col items-center justify-center flex-grow">
              <p className="font-bold text-lg sm:text-xl mb-2 text-cyan-700">Login Streak</p>
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Flame icon (SVG) */}
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flame text-yellow-500">
                  <path d="M8.5 14.5V20a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-5.5L18 10l-4-3.5 1.5-4C13.5 2 12 2 12 2S9.5 3.5 9.5 6.5l1.5 4L6 10l2.5 4.5Z" />
                </svg>
                <span className="text-5xl sm:text-6xl font-extrabold text-yellow-500">{user?.login_streak || 0}</span>
                <span className="text-sm text-gray-600">Days of consecutive learning</span>
              </div>
            </div>

            {/* Heatmap display - Responsive width: full on small, and grows on large. */}
            <div className="bg-white w-full rounded-3xl border border-gray-300 shadow-lg transform transition-transform duration-300 hover:scale-105 p-4 flex flex-col items-center flex-grow">
              <p className="font-bold text-lg sm:text-xl mb-2 text-cyan-700">Activity Heatmap</p>
              {/* Grid for heatmap cells. Individual cells retain fixed size for consistent visual. */}
              <div className="grid grid-cols-7 gap-1"> {/* 7 columns for days of the week */}
                {heatmapDisplayData.map((day, dayIndex) => (
                  <div key={dayIndex} className="flex flex-col gap-1">
                    {day.map((level, levelIndex) => (
                      <div
                        key={levelIndex}
                        className={`w-4 h-4 sm:w-5 sm:h-5 rounded-sm ${level && levelIndex === 0
                          ? 'bg-gray-200'
                          : level && levelIndex === 1
                            ? 'bg-cyan-100'
                            : level && levelIndex === 2
                              ? 'bg-cyan-300'
                              : level && levelIndex === 3
                                ? 'bg-cyan-500'
                                : level && levelIndex === 4
                                  ? 'bg-cyan-700'
                                  : 'bg-gray-200'
                          }`}
                        title={`Day ${dayIndex + 1}: Level ${levelIndex + 1}`}
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Last 7 days activity | Darker indicates more activity</p>
            </div>
          </div>
        </div>

        {/* Favorite Notebooks Section - This div will now take up available space. */}
        <div className='px-7'>
          <div className="flex flex-col gap-4 w-full bg-white rounded-3xl shadow-xl p-6 border border-gray-300">
            <h3 className="text-xl font-bold text-cyan-700 mb-2">Favorite Notebooks</h3>
            {/* Grid for notebook cards - highly responsive columns. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-2 sm:px-4">

              {pinnedNotebooks.map((pinned: any) => (
                <div
                  key={pinned.notebook.id}
                  onClick={(event) => handleNotebookClick(event, pinned.notebook.id)}
                  className="flex flex-col items-center transform transition-transform duration-300 hover:scale-105 cursor-pointer relative min-h-[180px]" // Added min-h for consistent card size
                >
                  {/* Adjusted image sizing and positioning to be relative to the card */}
                  <img
                    src="/binder.png"
                    alt="Dashboard Illustration"
                    className="absolute top-0 left-0 w-full h-full object-contain z-0 opacity-70" // Adjusted opacity for better text readability
                  />
                  {/* Adjusted card sizing to be flexible */}
                  <div className={`relative flex flex-col justify-center p-4 rounded-2xl z-10 shadow-lg w-full h-full`}
                    style={{ backgroundColor: pinned.notebook.color || '#FFD25E' }}>
                    <h3 className="text-lg font-bold text-white mb-1 truncate">{pinned.notebook.title}</h3>
                    {/* Using line-clamp for description to prevent overflow */}
                    <p className="text-white text-sm mb-2 line-clamp-2">{pinned.notebook.description}</p>
                    {pinned.notebook.mastery_goal && ( // Display mastery goal if it exists
                      <p className="text-white text-xs mt-auto">Goal: {new Date(pinned.notebook.mastery_goal).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
