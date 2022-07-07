import TextField from "@mui/material/TextField";
import { alpha, styled } from "@mui/material/styles";

const StyledTextField = styled(TextField)(({
	theme,
}) => ({
	color: theme.palette.success.main,
	".MuiOutlinedInput-input": {
		padding: ".5rem",
	},
}));

export default function DateTextField(params) {
  return (
  	<StyledTextField
  		{ ...params } />
	);
}