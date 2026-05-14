'use client';

import { useEffect, useState } from 'react';

interface Schedule {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  location?: string | null;
}

interface Semester {
  id: string;
  name: string;
}

interface Material {
  name: string;
  url: string;
}

interface Course {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  creditHours?: number | null;
  syllabus?: string | null;
  materials?: Material[];
  semester: Semester;
  schedules: Schedule[];
}

interface CourseModalProps {
  courseId: string;
  onClose: () => void;
}

export default function CourseModal({ courseId, onClose }: CourseModalProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        const data = await res.json();
        if (data.materials && typeof data.materials === 'string') {
          data.materials = JSON.parse(data.materials);
        }
        setCourse(data);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : course ? (
          <>
            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
              <div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-lg font-bold text-gray-900">{course.code}</h2>
                  {course.creditHours && (
                    <span className="text-xs text-gray-400">{course.creditHours} credits</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-0.5">{course.name}</p>
                <p className="text-xs text-gray-400 mt-1">{course.semester.name}</p>
              </div>
              <button type="button" title="Close" onClick={onClose} className="text-gray-400 hover:text-gray-600 -mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5 overflow-y-auto">
              {/* Description */}
              {course.description && (
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {course.description}
                </p>
              )}

              {/* Schedule */}
              {course.schedules.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Schedule</h4>
                  <div className="space-y-1.5">
                    {course.schedules.map((schedule) => (
                      <div key={schedule.id} className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-900">{schedule.day}</span>
                        <div className="text-gray-600">
                          {formatTime(schedule.startTime)} – {formatTime(schedule.endTime)}
                          {schedule.location && <span className="text-gray-400 ml-2">{schedule.location}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Syllabus */}
              {course.syllabus && (
                <a
                  href={course.syllabus}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Syllabus
                </a>
              )}

              {/* Materials */}
              {course.materials && course.materials.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Materials</h4>
                  <div className="space-y-1">
                    {course.materials.map((material, index) => (
                      <a
                        key={index}
                        href={material.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between py-2 px-3 -mx-3 rounded hover:bg-gray-50 transition-colors text-sm group"
                      >
                        <span className="text-gray-900">{material.name}</span>
                        <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {(!course.materials || course.materials.length === 0) && !course.syllabus && !course.description && course.schedules.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No additional details available.</p>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 shrink-0">
              <button type="button" onClick={onClose} className="w-full py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Close
              </button>
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-red-500 text-sm">Course not found</div>
        )}
      </div>
    </div>
  );
}
