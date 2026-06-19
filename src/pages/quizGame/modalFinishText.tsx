import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';

interface Props {
  open: boolean;
  canSubmit: boolean;
  unansweredQuestions: any[];
  questions: any[];
  onClose: () => void;
  onSubmit: () => void;
}

export const ModalFinishTest = ({
  open,
  canSubmit,
  unansweredQuestions,
  questions,
  onClose,
  onSubmit,
}: Props) => {
  return (
    <Dialog open={open} disableEscapeKeyDown onClose={onClose}>
      <DialogTitle>Nộp bài kiểm tra</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Bạn nên xem kỹ lại các câu trả lời trước khi nộp bài. Sau khi nộp sẽ
          không thể thay đổi đáp án.
        </DialogContentText>

        {!canSubmit && (
          <Box mt={2}>
            <Typography color="error.main" fontWeight={700} mb={1}>
              ⚠️ Bạn còn {unansweredQuestions.length} câu chưa trả lời:
            </Typography>

            {unansweredQuestions.map((q: any) => {
              const questionIndex = questions.findIndex(
                (item: any) => item.id === q.id,
              );

              return (
                <Typography key={q.id} color="error.main">
                  • Câu {questionIndex + 1}
                </Typography>
              );
            })}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {canSubmit && <Button onClick={onClose}>Xem lại bài</Button>}

        <Button color="success" variant="contained" onClick={onSubmit}>
          Nộp bài
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalFinishTest;
