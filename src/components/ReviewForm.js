import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Rating,
  Button,
  Typography,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const ReviewForm = ({ movieId, existingReview, onReviewSubmitted }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment || "");
    }
  }, [existingReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError("Please log in to write a review");
      return;
    }

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await authService.createReview(movieId, rating, comment);
      setSuccess(true);
      setComment(""); // Clear form after successful submission
      setRating(0);
      
      // Notify parent component to refresh reviews
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="body1" color="text.secondary">
            Please log in to write a review
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {existingReview ? "Edit Your Review" : "Write a Review"}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Review {existingReview ? "updated" : "submitted"} successfully!
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <Typography component="legend" gutterBottom>
              Your Rating
            </Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
                setError(null);
              }}
              size="large"
            />
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Review (optional)"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              setError(null);
            }}
            placeholder="Share your thoughts about this movie..."
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading || rating === 0}
            fullWidth
          >
            {loading ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;

