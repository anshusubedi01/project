fetch('get_events.php')
  .then(res => res.json())
  .then(events => {
    const eventList = document.getElementById('eventList');
    eventList.innerHTML = events.map(ev => `
      <div class="event">
        <h3>${ev.title}</h3>
        <p>${ev.description}</p>
        <p><b>Date:</b> ${ev.event_date}</p>
        <p><b>Location:</b> ${ev.location}</p>
      </div>
    `).join('');
  });