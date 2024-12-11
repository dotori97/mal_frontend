import { useState, useEffect, useRef } from "react";
import {
  Grid2,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
  Select,
  MenuItem,
  Button,
  Stack,
  Pagination,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { green, pink, red } from "@mui/material/colors";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpIcon from "@mui/icons-material/Help";
import moment from "moment";

import { useWord } from "../hooks/useWord";
import Category from "../components/Category";

const CARDS_PER_PAGE = 5;

const Dictionary = () => {
  const { handlefetchCategory, handleDeleteWord } = useWord();

  const [c_id, setC_id] = useState(null);
  const [id, setID] = useState(null);
  // Card을 backend에서 넘겨준 전체를 보관
  const cardsData = useRef([]);
  // const [cardsData, setCardsData] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [totalPages, setTotalPages] = useState(1); // page 갯수
  const [currentPage, setCurrentPage] = useState(1);
  const [shouldRender, setShouldRender] = useState(false);
  const [count, setCount] = useState(0);

  //초기 및 조회 데이터 없을때 빈 카드 하나 출력
  useEffect(() => {
    if (shouldRender || count == 0) {
      const data = [
        {
          id: 1,
          word: "내 사전에 오신걸 환영합니다.",
          c_date: moment().format("YYYY-MM-DD HH:mm:ss"),
          memo: "'내 사전 조회' 버튼을 눌러주세요",
          level: 0,
          des: "사용법 테스트 자료입니다.",
        },
      ];
      setTotalPages(1);
      setCurrentPage(1);
      setCurrentData(data); // Assuming `data` is an array
    }
  }, [shouldRender]);

  const handleCardClick = (id) => {
    setID(id);
  };

  const handlePagecount = (length) => {
    // 1페이지에 카드 5장씩 출력
    let pagecount = Math.ceil(length / CARDS_PER_PAGE);
    setTotalPages(pagecount);
  };

  const handlePageChange = (page, dictionarysData) => {
    setCurrentPage(page);
    handleCurrentData(dictionarysData, page);
  };

  const handleCurrentData = (dictionarysData, page) => {
    if (dictionarysData.length !== 0) {
      const currentCards = dictionarysData.slice(
        (page - 1) * CARDS_PER_PAGE,
        page * CARDS_PER_PAGE
      );
      setCurrentData(currentCards);
    } else {
      setShouldRender(!shouldRender);
    }
  };

  const handleIconByLevel = (level) => {
    switch (level) {
      case 10:
        return <SentimentVeryDissatisfiedIcon fontSize="large" />;
      case 5:
        return <SentimentNeutralIcon fontSize="large" />;
      case 0:
        return <SentimentVerySatisfiedIcon fontSize="large" />;
      default:
        return <HelpIcon fontSize="large" />;
    }
  };

  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme }) => ({
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
    variants: [
      {
        props: ({ expand }) => !expand,
        style: {
          transform: "rotate(0deg)",
        },
      },
      {
        props: ({ expand }) => !!expand,
        style: {
          transform: "rotate(180deg)",
        },
      },
    ],
  }));

  const handleExpandClick = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <div>
      <Grid2
        container
        spacing={2}
        sx={{
          width: "90vw",
          display: "flex", // Use Flexbox for alignment
          justifyContent: "center", // Center horizontally
          alignItems: "centerflex-start", // Center vertically
          mt: 4,
        }}
      >
        <Grid2 item size={6} sx={{ ml: 3 }}>
          <Category 
          width="100%"
          onSelect={setC_id} />
        </Grid2>

        <Grid2 item sx={{ mt: 1, ml: 2 }}>
          <Stack spacing={2} direction="row">
            <Button
              variant="contained"
              sx={{ width: "150px" }}
              onClick={async (e) => {
                console.log("1. input c_id, id 번호 >>>>>>>", c_id, id);
                const dictionarysData = await handlefetchCategory(c_id, id);
                console.log(
                  "조회후 dictionary category group data 수신 >>",
                  dictionarysData
                );
                // setCardsData(dictionarysData);
                cardsData.current = dictionarysData;
                handlePageChange(1, dictionarysData);
                // await handleCurrentData(dictionarysData,1);
                handlePagecount(dictionarysData.length);
              }}
            >
              내 사전 조회
            </Button>
            <Button
              onClick={async (e) => {
                // 삭제한 데이타 성공여부 조회 필요
                const data = await handleDeleteWord(id, cardsData.current);
                console.log("delete후 data 수신 >>>>>>>>>>>", data);
                cardsData.current = data;
                handlePageChange(1, data);
                handlePagecount(data.length);
              }}
              variant="outlined"
              sx={{ width: "150px" }}
            >
              선택 단어 삭제
            </Button>
          </Stack>
        </Grid2>
      </Grid2>

      {/* 컨텐츠 */}
      <Grid2
        container
        spacing={2}
        sx={{
          justifyContent: "center",
          mt: 8,
        }}        
      >
        {currentData.map((card, index) => (
          // {currentData.map((card, index) => (
          <Grid2 item key={index} size={2.3}>
            <Card
              onClick={() => setID(card.id)}
              sx={{
                maxWidth: 345,
                cursor: "pointer",
                border: id === card.id ? "3px solid blue" : "1px solid gray",
                // boxShadow: id === card.id ? "0 0 10px gray" : "none",
              }}
            >
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="number">
                    {parseInt(card.rowNum, 10) - 1 + 1}
                  </Avatar>
                }
                title={card.word}
                subheader={card.c_date}
              />
              <CardMedia
                component="img"
                height="150"
                image={card.image || "./logo192.png"} // Use default if image is missing
                alt={`${card.word}_img`}
              />
              <CardContent>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {card.memo}
                </Typography>
              </CardContent>
              <CardActions
                disableSpacing
                sx={{ justifyContent: "space-between" }}
              >
                <IconButton aria-label="level">
                  {handleIconByLevel(card.level)}
                </IconButton>
                <ExpandMore
                  expand={expandedCard === index}
                  onClick={() => handleExpandClick(index)}
                  aria-expanded={expandedCard === index}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              </CardActions>
              <Collapse
                in={expandedCard === index}
                timeout="auto"
                unmountOnExit
              >
                <CardContent>
                  <Typography sx={{ marginBottom: 2 }}>Description:</Typography>
                  <Typography sx={{ marginBottom: 2 }}>
                    {card.des || "추가 세부 사항 없음"}
                  </Typography>
                </CardContent>
              </Collapse>
            </Card>
          </Grid2>
        ))}
      </Grid2>

      {/* 페이징 */}
      <Grid2
        container
        sx={{
          // width: "80vw",
          justifyContent: "center", // Center horizontally
          mt: 8,
        }}
      >
        <Grid2 item>
          <Stack spacing={2}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, page) => {
                console.log("pagination 현재 페이지 번호 >>>>", page);
                handlePageChange(page, cardsData.current);
              }}
              color="primary"
              fontSize="large"
            />
          </Stack>
        </Grid2>
      </Grid2>
    </div>
  );
};

export default Dictionary;
