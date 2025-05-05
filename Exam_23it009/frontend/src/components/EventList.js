import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Box,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import noImage from '../assets/no-image.png';

const API_BASE_URL = 'http://127.0.0.1:5002/api';

const EventList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get(`${API_BASE_URL}/events`);
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events. Please make sure the backend server is running on port 5002.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/search?query=${searchQuery}`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error searching events:', error);
      setError('Failed to search events. Please try again.');
    }
  };

  const getEventTypeColor = (type) => {
    const colors = {
      Academic: 'primary',
      Cultural: 'secondary',
      Sports: 'success',
      Technical: 'info',
      Other: 'default',
    };
    return colors[type] || 'default';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Events
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/events/create')}
        >
          Create Event
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Search Events"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
              onClick={() => navigate(`/events/${event._id}`)}
            >
              <CardMedia
                component="img"
                height="140"
                image={event.image ? `http://127.0.0.1:5002/${event.image}` : noImage}
                alt={event.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = noImage;
                }}
                sx={{
                  objectFit: 'cover',
                  height: '140px'
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {event.description}
                </Typography>
                <Box mt={2}>
                  <Chip
                    label={event.eventType}
                    color={getEventTypeColor(event.eventType)}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={event.status}
                    color={event.status === 'upcoming' ? 'primary' : 'default'}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Date: {new Date(event.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Venue: {event.venue}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default EventList; 