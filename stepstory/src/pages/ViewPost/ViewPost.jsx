import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import PostCard from "../../components/PostCard/PostCard";
import Map from "../../components/Map/Map";
import TravelPeriod from "../../components/TravelPeriod/TravelPeriod";
import PostComments from "../../components/PostComments/PostComments";
import axios from './../../apis/axios';
import "./style.css";

export default function ViewPost() {
  const [postData, setPostData] = useState(null);
  const [showComments, setShowComments] = useState(false);

  const { travelReportId } = useParams();

  const comments = [
    {
      user: "양혜인",
      date: "2024.03-09",
      content: "여행할게 아니라 출석을 하라고"
    },
    {
      user: "맹인호",
      date: "2024.03-09",
      content: "동겸아 출석좀 잘해라"
    },
    {
      user: "임창희",
      date: "2024.03-09",
      content: "프론트 파이팅"
    },
    {
      user: "이인홍",
      date: "2024.03-09",
      content: "백엔드도 파이팅"
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`no-auth/travel-report/${travelReportId}`);
        if (response.data.success) {
          setPostData(response.data.data);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("There was an error fetching the post data:", error);
      }
    };

    fetchData();
  }, [travelReportId]);

  const handleCommentButtonClick = () => {
    setShowComments(prevShowComments => !prevShowComments);
  };

  if (!postData) {
    return <div>Loading...</div>;
  }

  const { viewTravelImageListDto, commonUserSourseDto, title, body, createdAt, updatedAt, wantToGoCount } = postData;
  const images = viewTravelImageListDto.viewTravelImageDtos.map(dto => ({
    src: dto.travelImageUrl,
    alt: `Location: ${dto.detailCourse.locationName}`,
  }));
  const locationsGps = viewTravelImageListDto.viewTravelImageDtos.map(dto => ({
    lat: dto.detailCourse.latitude,
    lng: dto.detailCourse.longitude,
  }));
  const startDate = new Date(Math.min(...viewTravelImageListDto.viewTravelImageDtos.map(dto => dto.detailCourse.travelDate))).toLocaleDateString();
  const endDate = new Date(Math.max(...viewTravelImageListDto.viewTravelImageDtos.map(dto => dto.detailCourse.travelDate))).toLocaleDateString();

  return (
    <div className="post-container-view-post">
        <Header locationName={title} />
        <div className="post-layout-view-post">
            <div className="left-panel-view-post">
                <PostCard 
                  images={images}
                  profileImage={commonUserSourseDto.profileImgUrl}
                  user={commonUserSourseDto.nickname} 
                  date={new Date(createdAt).toLocaleDateString()}
                  title={title} 
                  content={body}
                  onCommentClick={handleCommentButtonClick}/>
            </div>
            <div className="right-panel-view-post">
                {showComments ? <PostComments comments={comments} /> : <><Map locationsGps={locationsGps} /><TravelPeriod startDate={startDate} endDate={endDate}/></>}
            </div>
        </div>
    </div>
  );
}
