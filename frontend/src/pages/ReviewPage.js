import React, {useState} from "react";
import {useParams} from "react-router-dom";
import ReviewForm from "../components/reviews/ReviewForm";
import ReviewsShowcase from "../components/reviews/ReviewsShowcase";
import {Dialog} from "@mui/material";

const ReviewPage = () => {
  const {orderId} = useParams();
  const [modalOpen, setModalOpen] = useState(Boolean(orderId));

  const handleClose = () => setModalOpen(false);

  return (
    <>
      <ReviewsShowcase />
      <Dialog open={modalOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <ReviewForm orderId={orderId} onSuccess={handleClose} />
      </Dialog>
    </>
  );
};

export default ReviewPage;
