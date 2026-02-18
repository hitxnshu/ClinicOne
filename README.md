# Clinic Management System - Frontend

A modern, responsive clinic management system built with React and Vite. This is a frontend-only implementation showcasing a professional medical interface.

## Features

### 🔐 Authentication
- Role-based login (Admin, Doctor, Receptionist)
- Secure authentication flow

### 📊 Dashboard
- Real-time statistics overview
- Recent appointments display
- Task management
- Quick action buttons

### 👥 Patient Management
- Add, view, and edit patient records
- Search and filter patients
- Patient status tracking
- Comprehensive patient information

### 📅 Appointment Management
- Book and manage appointments
- Calendar view with mini calendar
- Appointment status tracking
- Time slot management
- Filter by date and view options

### 👨‍⚕️ Doctor Management
- Doctor profiles with specializations
- Availability status
- Contact information
- Experience tracking

### 📋 Medical Records
- Patient medical history
- Diagnosis and prescription tracking
- View and edit records
- Export to PDF

### 📈 Reports & Analytics
- Patient statistics
- Appointment trends
- Financial reports
- Doctor performance metrics

### ⚙️ Settings
- Clinic information management
- Working hours configuration
- Notification preferences
- Security settings

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router DOM** - Navigation and routing
- **CSS3** - Styling with CSS variables and modern layouts
- **Google Fonts** - DM Sans and Playfair Display

## Installation

1. **Clone or extract the project:**
   ```bash
   cd clinic-management-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## Login Credentials

Since this is a frontend-only demo, you can use any username/password combination. Simply select your role:

- **Admin** - Full access to all features
- **Doctor** - Access to patients, appointments, and medical records
- **Receptionist** - Access to patients, appointments, and doctors

## Project Structure

```
clinic-management-system/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Sidebar.jsx
│   │   ├── Sidebar.css
│   │   ├── Header.jsx
│   │   └── Header.css
│   ├── pages/              # Page components
│   │   ├── Login.jsx
│   │   ├── Login.css
│   │   ├── Dashboard.jsx
│   │   ├── Dashboard.css
│   │   ├── Patients.jsx
│   │   ├── Patients.css
│   │   ├── Appointments.jsx
│   │   ├── Appointments.css
│   │   ├── Doctors.jsx
│   │   ├── MedicalRecords.jsx
│   │   ├── Reports.jsx
│   │   └── Settings.jsx
│   ├── App.jsx             # Main app component
│   ├── App.css             # Global styles
│   └── main.jsx            # Entry point
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
└── package.json            # Dependencies
```

## Design Features

### Color Palette
- **Primary Blue**: #0066cc - Main brand color
- **Secondary Green**: #00a86b - Success states
- **Accent Red**: #ff6b6b - Alerts and important actions
- **Warning Orange**: #ffa726 - Warning states
- **Background**: #f8f9fc - Clean, professional background
- **Surface**: #ffffff - Card backgrounds

### Typography
- **Display Font**: Playfair Display - For headings and titles
- **Body Font**: DM Sans - For body text and UI elements

### UI/UX Highlights
- Smooth animations and transitions
- Responsive design for all screen sizes
- Intuitive navigation with role-based access
- Modern card-based layouts
- Interactive hover states
- Modal forms for data entry
- Professional medical aesthetic

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready to be deployed to any static hosting service.

## Preview Production Build

```bash
npm run preview
```

## Customization

### Changing Colors
Edit the CSS variables in `src/App.css`:

```css
:root {
  --primary: #0066cc;
  --secondary: #00a86b;
  --accent: #ff6b6b;
  /* ... other variables */
}
```

### Adding Features
Since this is a frontend-only application, you can:
1. Add new pages in `src/pages/`
2. Add routes in `src/App.jsx`
3. Create reusable components in `src/components/`

### Integrating Backend
To connect this to a backend:
1. Install axios or fetch API wrapper
2. Create API service files
3. Replace mock data with API calls
4. Add authentication token management
5. Implement error handling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This is a demo project for educational and portfolio purposes.

## Future Enhancements

Potential features to add:
- [ ] Backend integration
- [ ] Real-time notifications
- [ ] Advanced search and filtering
- [ ] Data visualization charts
- [ ] Print functionality
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Export to various formats
- [ ] Email integration
- [ ] SMS reminders

## Contributing

This is a demo project, but feel free to fork and customize for your own use!

## Support

For questions or issues, please refer to the React and Vite documentation:
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
