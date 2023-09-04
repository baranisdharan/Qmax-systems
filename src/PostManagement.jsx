// PostManagement.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  TextField,
} from "@mui/material";

const API_BASE_URL = "https://jsonplaceholder.typicode.com";

function PostManagement() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [deleteQueue, setDeleteQueue] = useState([]);

  // Load posts on initial page load
  useEffect(() => {
    axios.get(`${API_BASE_URL}/posts`).then((response) => {
      setPosts(response.data);
    });
  }, []);

  // Filter posts based on search term
  useEffect(() => {
    const filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchTerm, posts]);

  const handleDelete = (postId) => {
    // Queue the delete request
    setDeleteQueue((prevQueue) => [...prevQueue, postId]);
  };
  
  // Fire queued delete requests
  useEffect(() => {
    const deletePosts = async () => {
      for (const postId of deleteQueue) {
        try {
          await axios.delete(`${API_BASE_URL}/posts/${postId}`);
          // Remove the deleted post from the local state
          setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        } catch (error) {
          console.error(`Error deleting post ${postId}:`, error);
        }
      }
      // Clear the delete queue
      setDeleteQueue([]);
    };
  
    if (deleteQueue.length > 0) {
      deletePosts();
    }
  }, [deleteQueue, setPosts]);
  

  // Handle dialog open
  const handleDialogOpen = (postId) => {
    setSelectedPost(postId);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setSelectedPost(null);
  };

  // Handle refresh button click
  const handleRefresh = () => {
    // Clear local state
    setSearchTerm("");
    setPosts([]);
    setFilteredPosts([]);
    setDeleteQueue([]);

    // Fetch data from API and display
    axios.get(`${API_BASE_URL}/posts`).then((response) => {
      setPosts(response.data);
    });
  };

  return (
    <div>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleRefresh}>
        Refresh State
      </Button>
      {filteredPosts.map((post) => (
        <Card key={post.id} sx={{ margin: 2 }}>
          <CardContent>
            <Typography variant="h6">{post.title}</Typography>
            <Typography>{post.body}</Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleDialogOpen(post.id)}
            >
              Show Comments
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDelete(post.id)}
            >
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
      <Dialog open={selectedPost !== null} onClose={handleDialogClose}>
        <CardContent>
          <Typography variant="h6">Comments for Post {selectedPost}</Typography>
          {/* Fetch and display comments for the selected post here */}
        </CardContent>
      </Dialog>
    </div>
  );
}

export default PostManagement;
