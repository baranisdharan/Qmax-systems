// PostDialog.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, CardContent, Typography } from "@mui/material";

const API_BASE_URL = "https://jsonplaceholder.typicode.com";

function PostDialog({ postId, open, onClose }) {
  const [comments, setComments] = useState([]);

  // Fetch comments for the selected post
  useEffect(() => {
    if (open && postId) {
      axios.get(`${API_BASE_URL}/posts/${postId}/comments`).then((response) => {
        setComments(response.data);
      });
    }
  }, [postId, open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <CardContent>
        <Typography variant="h6">Comments for Post {postId}</Typography>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <Typography variant="body2">
                <strong>{comment.name}</strong> - {comment.body}
              </Typography>
            </li>
          ))}
        </ul>
      </CardContent>
    </Dialog>
  );
}

export default PostDialog;
