import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Popcal from './Popcal';
import '../css/MycalPage.css';
import logoImage from '../logo.png';

function MycalPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);

  const handleDateClick = ({ dateStr }) => {
    setSelectedDate(dateStr);
    setSelectedEvent(null);
    setIsPopupOpen(true);
  };

  const handleRecordButtonClick = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setSelectedEvent(null);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSaveMovieData = (movieData) => {
    const eventDetails = {
      id: selectedEvent ? selectedEvent.id : Date.now().toString(), // Ensure unique ID
      title: movieData.movie_title,
      start: movieData.watch_date || selectedDate,
      allDay: true,
      extendedProps: {
        movie_content: movieData.movie_content
      }
    };

    const updatedEvents = selectedEvent
      ? events.map(event => event.id === selectedEvent.id ? eventDetails : event)
      : [...events, eventDetails];

    setEvents(updatedEvents);
    setIsPopupOpen(false);
  };

  const handleEventClick = ({ event }) => {
    setSelectedDate(event.startStr);
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.startStr,
      movie_content: event.extendedProps.movie_content
    });
    setIsPopupOpen(true);
  };

  const handleDeleteEvent = (eventId) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
  };

  return (
    <div className="mycalPage">
      <Link to="/">
        <img src={logoImage} alt="Logo" className="myPageLogo" />
      </Link>
      <div className="myPageTitle">마이페이지</div>
      <div className="navButtons">
        <Link to="/my/watched" className="navButton">이미 본 영화</Link>
        <Link to="/my/wishlist" className="navButton">보고싶은 영화</Link>
        <Link to="/my/calendar" className="navButton active">MOVIELY 캘린더</Link>
      </div>
      <button onClick={handleRecordButtonClick} className="recordButton">
        영화 관람 기록하기
      </button>
      <div className="calendar-container">
        <FullCalendar
          key={events.length}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          events={events}
          height="470px"
        />
      </div>
      {isPopupOpen && (
        <Popcal
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          onSave={handleSaveMovieData}
          onDelete={handleDeleteEvent}
          initialData={selectedEvent}
        />
      )}
    </div>
  );
}

export default MycalPage;
