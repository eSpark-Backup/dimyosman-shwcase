import {
  Box,
  Button,
  LinearProgress,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  addGrey,
  brandIcon,
  brandMain,
  brandUserImage,
  comment,
  eventUserImage,
  like,
  liked,
  share,
} from "../assets";
import { useNavigate } from "react-router-dom";
import ShareModal from "./shareModal";
import { LoadingButton } from "@mui/lab";
import { useAddInFavouritesMutation } from "../services/favourite";
import { toast } from "react-toastify";
import { useFollowMutation } from "../services/follower";
import CommentModal from "./commentModal";
import CommentSuccessModal from "./commentSuccessModal";

const BrandCard = ({
  myProfile,
  items,
  filter1,
  filter2,
  filter3,
  filter4,
  loading,
}) => {
  const theme = useTheme();
  const [selectedChoice, setSelectedChoice] = useState(0);
  const [showShareBox, setShowShareBox] = useState(false);
  const [likeFunc, { isLoading }] = useAddInFavouritesMutation();
  const [follow, { isLoading: followLoading }] = useFollowMutation();
  const [brand, setBrand] = useState({});
  const [brandId, setBrandId] = useState(null);
  const [commentModal, setCommentModal] = useState(false);
  const [commentId, setCommentId] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const navigate = useNavigate();
  const filteredItems = items?.filter((item) => {
    if (selectedChoice === 1) return item.status === "PUBLISH";
    if (selectedChoice === 2) return item.status === "DRAFT";
    if (selectedChoice === 3) return item.status === "ARCHIVE";
    return true;
  });
  
  useEffect(() => {
    setMainArr(filteredItems)
  }, [selectedChoice])
  
  const [mainArr, setMainArr] = useState(filteredItems);
  const handleLikeUpdate = (id) => {
    const tempArr = mainArr.map((item) => {
      return item.id === id
        ? { ...item, isFavourite: !item?.isFavourite }
        : item;
    });
    setMainArr(tempArr);
  };
  const handleFollowUpdate = (id) => {
    const tempArr = mainArr.map((item) => {
      return item.id === id ? { ...item, isFollowed: !item?.isFollowed } : item;
    });
    setMainArr(tempArr);
  };
  if (loading) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }
  return (
    <Box sx={{ mt: "50px" }}>
      {myProfile && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            rowGap: "10px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              columnGap: "16px",
              flexDirection: { xs: "column", sm: "row" },
              rowGap: "2px",
            }}
          >
            <Typography
              sx={{
                textAlign: "left",
                color: theme.palette.primary.main,
                fontWeight: "400",
                fontSize: "16px",
              }}
            >
              Show:
            </Typography>
            <Typography
              onClick={() => setSelectedChoice(0)}
              sx={{
                textAlign: "left",
                color: theme.palette.primary.main,
                fontWeight: selectedChoice === 0 ? "600" : "400",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              {filter1}
            </Typography>
            <Typography
              onClick={() => setSelectedChoice(1)}
              sx={{
                textAlign: "left",
                color: theme.palette.primary.main,
                fontWeight: selectedChoice === 1 ? "600" : "400",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              {filter2}
            </Typography>
            <Typography
              onClick={() => setSelectedChoice(2)}
              sx={{
                textAlign: "left",
                color: theme.palette.primary.main,
                fontWeight: selectedChoice === 2 ? "600" : "400",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              {filter3}
            </Typography>
            <Typography
              onClick={() => setSelectedChoice(3)}
              sx={{
                textAlign: "left",
                color: theme.palette.primary.main,
                fontWeight: selectedChoice === 3 ? "600" : "400",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              {filter4}
            </Typography>
          </Box>
          <Button
            sx={{
              backgroundColor: "rgb(209, 219, 215, 0.4)",
              height: "31px",
              width: "142px",
              color: theme.palette.primary.main,
              fontWeight: "600",
              fontSize: "16px",
              display: "flex",
              columnGap: "6px",
              alignItems: "center",
              "&:hover": {
                backgroundColor: "rgb(209, 219, 215, 0.4)",
              },
              textTransform: "none",
            }}
            onClick={() => navigate("/new-brand")}
          >
            <img src={addGrey} alt="" />
            Add New
          </Button>
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: "30px",
          mt: "50px",
        }}
      >
        {mainArr.length > 0 ? (
          mainArr?.map((item, index) => {
            return (
              <Box
                sx={{
                  border: "1px solid #eff2f1",
                  borderRadius: "5px",
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: { xs: "column", md: "row" },
                  rowGap: "15px",
                  overflow: "hidden",
                  width: "100%",
                }}
                key={index}
              >
                <Box
                  sx={{
                    pt: "10px",
                    pr: "10px",
                    pl: "10px",
                    pb: { xs: "10px", xl: "0px" },
                    width: { xs: "100%", md: "50%" },
                    rowGap: "30px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: "100%", md: "80%" },
                      display: "flex",
                      columnGap: "10px",
                      alignItems: { xs: "flex-start", sm: "center" },
                      flexDirection: { xs: "column", sm: "row" },
                      rowGap: "10px",
                    }}
                  >
                    <Box
                      sx={{
                        width: "64px",
                        height: "64px",
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          borderRadius: "5px",
                          border: "1px solid rgb(209, 219, 215, 0.4)",
                          background: "rgb(209, 219, 215, 0.4)",
                          height: "62px",
                        }}
                      >
                        {item?.profileImage && <figure
                          style={{ width: "100%", height: "100%" }}
                          role="img"
                        >
                          <img
                            src={item?.profileImage}
                            alt="User Image"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </figure>}
                      </Box>
                      <Box
                        sx={{
                          background: "rgb(196, 119, 127)",
                          width: "16px",
                          height: "16px",
                          position: "absolute",
                          bottom: "0px",
                          right: "0px",
                          borderRadius: "5px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <figure
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          role="img"
                        >
                          <img
                            src={brandIcon}
                            alt="Icon"
                            style={{ width: "12px", height: "10px" }}
                          />
                        </figure>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        columnGap: "5px",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: "600",
                          textAlign: "left",
                        }}
                        variant="h2"
                      >
                        {item?.brandName}
                      </Typography>
                      {item?.brandCategory?.map((item, index) => {
                        return (
                          <Typography
                            sx={{
                              color: theme.palette.primary.main,
                              fontWeight: "400",
                              textAlign: "left",
                              fontSize: { xs: "10px", lg: "16px" },
                            }}
                            key={index}
                          >
                            {item}
                          </Typography>
                        );
                      })}
                    </Box>
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: "400",
                      color: theme.palette.primary.main,
                      textAlign: "left",
                    }}
                  >
                    {item?.description?.length > 196
                      ? item?.description?.slice(0, 197) + "..."
                      : item?.description}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexDirection: { xs: "column", lg: "row" },
                      rowGap: "15px",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        columnGap: "10px",
                      }}
                    >
                      {!myProfile && (
                        <figure
                          style={{ width: "100%", height: "100%" }}
                          role="img"
                        >
                          <img
                            onClick={() => {
                              if (!isLoading) {
                                setBrandId(item?.id);
                                likeFunc({
                                  entityId: item?.id,
                                  entityType: "BRAND",
                                }).then((res) => {
                                  res?.data?.status &&
                                    handleLikeUpdate(item?.id);
                                  toast.success(
                                    res?.data?.message
                                      .replace("Entity", "Post")
                                      .replace(" successfully", "")
                                  );
                                  setBrandId(null);
                                });
                              }
                            }}
                            style={{
                              cursor:
                                brandId === item?.id && isLoading
                                  ? "not-allowed"
                                  : "pointer",
                              animation:
                                brandId === item?.id && isLoading
                                  ? "pulse 1s infinite"
                                  : "none",
                              opacity:
                                brandId === item?.id && isLoading ? 0.5 : 1,
                            }}
                            src={item?.isFavourite ? liked : like}
                            className={`like-icon ${
                              isLoading ? "loading" : ""
                            }`}
                            alt="Like Icon"
                          />
                        </figure>
                      )}

                      {!myProfile && (
                        <figure
                          onClick={() => {
                            setCommentId(item?.id); 
                            setCommentModal(true)}}
                          style={{ width: "100%", height: "100%" }}
                          role="img"
                        >
                          <img src={comment} alt="Share Icon" style={{ cursor: "pointer" }} />
                        </figure>
                      )}
                      {item?.status === "PUBLISH" && (
                        <figure
                          onClick={() => {
                            setBrand(item);
                            setShowShareBox(true);
                          }}
                          style={{ width: "100%", height: "100%" }}
                          role="img"
                        >
                          <img src={share} alt="Share Icon" style={{ cursor: "pointer" }} />
                        </figure>
                      )}
                    </Box>
                    {!myProfile && (
                      <Typography
                        onClick={() => navigate(`/brand/${item?.id}`)}
                        sx={{
                          cursor: "pointer",
                          color: theme.palette.primary.main,
                          textAlign: "left",
                        }}
                        variant="h5"
                      >
                        Learn more
                      </Typography>
                    )}
                    <LoadingButton
                      loading={brandId === item?.id && followLoading}
                      disabled={brandId === item?.id && followLoading}
                      sx={{
                        backgroundColor: "rgb(209, 219, 215, 0.4)",
                        width: {
                          xs: "150px",
                          sm: myProfile ? "348px" : "166px",
                        },
                        height: "31px",
                        fontSize: "16px",
                        fontWeight: "700",
                        color: theme.palette.primary.main,
                        display: "flex",
                        columnGap: "5px",
                        textTransform: "none",
                        ":hover": {
                          backgroundColor: "rgb(209, 219, 215, 0.4)",
                        },
                      }}
                      onClick={
                        myProfile
                          ? () => navigate(`/brand/${item?.id}/edit`)
                          : !followLoading
                          ? () => {
                              setBrandId(item?.id);
                              follow({
                                entityId: item?.id,
                                entityType: "BRAND",
                              }).then((res) => {
                                res?.data?.status &&
                                  handleFollowUpdate(item?.id);
                                toast.success(
                                  `You ${
                                    item?.isFollowed ? "Unfollowed" : "Followed"
                                  } ${item?.brandName}`
                                );
                                setBrandId(null);
                              });
                            }
                          : () => {}
                      }
                    >
                      {myProfile
                        ? "Edit"
                        : item?.isFollowed
                        ? "Unfollow"
                        : "Follow"}
                    </LoadingButton>
                  </Box>
                </Box>
                <Box
                  sx={{
                    width: { xs: "100%", md: "50%" },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "280px",
                    background: "rgb(209, 219, 215, 0.4)",
                  }}
                >
                  {item?.brandImage && <figure style={{ width: "100%", height: "100%" }} role="img">
                    <img
                      src={item?.brandImage}
                      alt="Image"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </figure>}
                </Box>
              </Box>
            );
          })
        ) : (
          <Typography
            sx={{ width: "100%" }}
            fontWeight={700}
            textAlign="center"
          >
            No Data
          </Typography>
        )}
      </Box>
      <CommentModal
        open={commentModal}
        handleClose={() => {
          setCommentId(null);
          setCommentModal(false)
        }}
        handleSuccess={() => setSuccessModal(true)}
        commentId={commentId}
      />
      <CommentSuccessModal
        open={successModal}
        handleClose={() => setSuccessModal(false)}
      />
      <ShareModal
        myProfileData={{
          profile: brand?.profileImage,
          profileName: brand?.brandName,
        }}
        shareableLink={brand?.shareableLink}
        open={showShareBox}
        handleClose={() => setShowShareBox(false)}
      />
    </Box>
  );
};

export default BrandCard;
