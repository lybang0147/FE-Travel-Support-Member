import { FC, ChangeEvent, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import User from 'models/user';
import LockTwoToneIcon from '@mui/icons-material/LockTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import authenticationService from 'api/authenticationApi';
import Helmet from 'react-helmet'
import Label from 'components/Label';
import stayService from 'api/stayApi';
import PageAddListing1 from 'containers/PageAddListing1/PageAddListing1';
import { Link, useParams } from 'react-router-dom';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  MenuItem,
  Typography,
  useTheme,
  CardHeader,
  CardContent,
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import CheckIcon from '@mui/icons-material/Check';
import { MeetingRoom, Report } from '@mui/icons-material';
import toast from 'react-hot-toast';
import Stay from 'models/stay';
import { EventAvailable } from '@mui/icons-material';
import { Booking } from 'models/booking';
import Rating from 'models/rating';
import ratingService from 'api/ratingApi';

interface RecentUsersTableProps {
  className?: string;
}

interface Filters {
  status?: number;
}



const applyPagination = (ratings: Rating[], page: number, limit: number): Rating[] => {
  return ratings.slice(page * limit, page * limit + limit);
};

const OwnerStayRatingPageContent: FC<RecentUsersTableProps> = ({}) => {
  const { id } = useParams();
  const [stays, setStays] = useState<Stay>();
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [needFetch, setNeedFetch] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchKey, setSearchKey] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>([]);

  const [filters, setFilters] = useState<Filters>({
    status: undefined,
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const fetchStays = async () => {
      try {
        const ratingList = await ratingService.searchRating(id ?? "");
        const stay = await stayService.getStayWithId(id ?? "");
        setStays(stay);
        setRatings(ratingList);
      } catch (error) {
        toast.error('Lỗi khi lấy dữ liệu đánh giá');
        console.log(error);
      }
    };

    const debounceFetch = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(fetchStays, 1000);
    };
    debounceFetch();
    return () => {
      clearTimeout(timeoutId);
    };

  }, [needFetch, searchKey]);

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
    setSelectedStatus(null);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
    setPage(0);
  };


  const paginatedRatings = applyPagination(ratings, page, limit);

  const blueCardCount = ratings.length;
  const greenCardCount = ratings.length!=0 ? parseFloat((ratings.reduce((sum, rating) => sum + (rating.rate ?? 0), 0) /
  ratings.length).toFixed(1)) : 0;
  

  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    const parsedValue = selectedValue === "both" ? null : selectedValue === "true";
    setSelectedStatus(parsedValue !== null ? parsedValue.toString() : null);
  };

  const handleReportComment = async (ratingId: string) => {
    try
    {
        setIsProcessing(true);
        await ratingService.reportRating(ratingId);
        toast.success("Báo xấu đánh giá thành công")
    }
    catch(error)
    {
        toast.error("Báo xấu đánh giá thất bại")
    }
    finally
    {
        setIsProcessing(false);
    }
  }

  const theme = useTheme();
  return (
    <div>
      <Helmet>
        <title>UTEOwner</title>
      </Helmet>
      <Box p={2} display="flex" >
        <Card sx={{ backgroundColor: '#1976d2', color: '#fff', width: 300 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {blueCardCount}
            </Typography>
            <Typography variant="body2" component="div">
              Tổng số đánh giá
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ backgroundColor: '#4caf50', color: '#fff', width: 300, marginLeft:15 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {greenCardCount}
            </Typography>
            <Typography variant="body2" component="div">
              Điểm đánh giá trung bình
            </Typography>
          </CardContent>
        </Card>
      </Box>
    <Card>
    <CardHeader
      title={
        <Typography variant="h6" sx={{ mb: 2 }}>
          Quản lý đánh giá
        </Typography>
      }
      action={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Box mr={1}>
            <TextField
              label="Tìm kiếm"
              variant="outlined"
              size="small"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </Box>
          <Box>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={selectedStatus || 'both'}
                onChange={handleStatusFilterChange}
                label="Trạng thái"
              >
                <MenuItem value="both">Tất cả</MenuItem>
                <MenuItem value="true">Hoạt động</MenuItem>
                <MenuItem value="false">Bị chặn</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
      }
    />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên người đánh giá</TableCell>
              <TableCell>Điểm đánh giá</TableCell>
              <TableCell align="right">Nội dung</TableCell> 
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRatings.map((rating) => {
              return (
                <TableRow hover key={rating.id}>
                  <TableCell>
                  <Typography  variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                    {rating.userRating?.fullName ?? ""}
                  </Typography>
                  </TableCell>
                  <TableCell>
                  <Typography  variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                    {rating.rate ?? 0}
                  </Typography>
                  </TableCell>
                  <TableCell align="right">
                  <Typography  variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                    {rating.message ?? ""}
                  </Typography>
                  </TableCell>
                  <TableCell align="right">
                  <Tooltip title="Báo xấu" arrow>
                        <IconButton
                          sx={{
                            '&:hover': { background: theme.palette.success.light },
                            color: theme.palette.success.main,
                          }}
                          color="inherit"
                          size="small"
                          onClick={() => handleReportComment(rating.id ?? "")}
                        >
                          <Report fontSize="small" />
                        </IconButton>
                      </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={ratings.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>

    </Card>
    <Dialog open={isProcessing}>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
            <CircularProgress size={20} />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Đang xử lý...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OwnerStayRatingPageContent;
