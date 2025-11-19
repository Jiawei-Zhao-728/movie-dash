import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Rating,
  Avatar,
  IconButton,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";

const ReviewList = ({ reviews, onReviewDeleted }) => {
  const { user } = useAuth();

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      await authService.deleteReview(reviewId);
      if (onReviewDeleted) {
        onReviewDeleted();
      }
    } catch (error) {
      alert(error.message || "Failed to delete review");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!reviews || reviews.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No reviews yet. Be the first to review this movie!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Reviews ({reviews.length})
      </Typography>
      {reviews.map((review, index) => {
        const isOwner = user && review.userId === user.id;
        const avatarLetter = review.username
          ? review.username[0].toUpperCase()
          : "U";

        return (
          <React.Fragment key={review.id}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      {avatarLetter}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {review.username || "Anonymous"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(review.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                  {isOwner && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(review.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>

                <Box sx={{ mb: 1 }}>
                  <Rating value={review.rating} readOnly size="small" />
                </Box>

                {review.comment && (
                  <Typography variant="body2" color="text.secondary">
                    {review.comment}
                  </Typography>
                )}
              </CardContent>
            </Card>
            {index < reviews.length - 1 && <Divider sx={{ my: 1 }} />}
          </React.Fragment>
        );
      })}
    </Box>
  );
};

export default ReviewList;

