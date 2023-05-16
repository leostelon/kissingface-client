import { Box, CircularProgress, Dialog, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getWalletAddress, switchChain } from "../utils/wallet";
import FactoryInterface from "../contracts/Factory.json";
import { createToken } from "../api/token";

const InputProps = {
	style: {
		color: "white",
		border: "1px solid white",
	},
};
const HelperProps = {
	style: {
		color: "white",
	},
};

export const CreateAccessTokenDialog = ({
	datasetId,
	isOpen,
	handleExternalClose,
}) => {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("mytoki");
	const [maxSupply, setMaxSupply] = useState(5000);
	const [pricePerToken, setPricePerToken] = useState(0.001);
	const [minimumPurchase, setMinimumPurchase] = useState(10);

	const handleClose = (event, reason) => {
		setOpen(false);
		if (handleExternalClose) {
			handleExternalClose();
		}
	};

	async function createNewToken() {
		try {
			if (loading) return;
			if (!name || !maxSupply || !pricePerToken || !minimumPurchase)
				return toast("Please fill all the details", { type: "info" });

			setLoading(true);

			// Contract Interaction
			await switchChain();
			const contract = new window.web3.eth.Contract(
				FactoryInterface.abi,
				"0xb1Cf086A2A4061e5f448Ce84d726b68A391dB17a"
			);
			const currentAddress = await getWalletAddress();

			// Gas Calculation
			const gasPrice = await window.web3.eth.getGasPrice();
			const gas = await contract.methods
				.deployToken(name, name, maxSupply)
				.estimateGas({
					from: currentAddress,
				});
			const resp = await contract.methods
				.deployToken(name, name, maxSupply)
				.send({ from: currentAddress, gasPrice, gas });

			// Server Interaction
			const tokenAddress = resp.events.TokenDeployed.returnValues.tokenAddress;
			const body = {
				datasetId,
				name,
				tokenAddress,
				minimumPurchase,
				pricePerToken,
				maxSupply,
			};
			const response = await createToken(body);
			setLoading(false);
			if (response.status === 200) {
				toast("Token creation success🥳🍾", { type: "success" });
				await new Promise((res, rej) => {
					setTimeout(() => {
						res(true);
					}, 2000);
				});
				window.location.reload();
			} else {
				toast(response.data.message, { type: "error" });
			}
		} catch (error) {
			toast(error.message);
			setLoading(false);
		}
	}

	useEffect(() => {
		if (isOpen) {
			setOpen(isOpen);
		}
	}, [isOpen]);

	return (
		<Dialog open={open} fullWidth maxWidth="xs" onClose={handleClose}>
			<Box
				sx={{
					p: 2,
					textAlign: "center",
					width: "100%",
					backgroundColor: "#171e25",
					color: "white",
				}}
			>
				<Box>
					<h2>Create Access Token</h2>
					<br />
				</Box>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						flexDirection: "column",
					}}
				>
					<Box sx={{ mt: 1 }}>
						<TextField
							placeholder="Enter token name"
							size="small"
							value={name}
							onChange={(e) => {
								setName(e.target.value);
							}}
							InputProps={InputProps}
						/>
					</Box>
					<Box sx={{ mt: 2 }}>
						<TextField
							placeholder="Enter max supply"
							type="number"
							size="small"
							value={maxSupply}
							onChange={(e) => {
								setMaxSupply(e.target.value);
							}}
							helperText="Max supply of the token."
							FormHelperTextProps={HelperProps}
							InputProps={InputProps}
						/>
					</Box>
					<Box sx={{ mt: 2 }}>
						<TextField
							placeholder="Enter price per token"
							type="number"
							size="small"
							value={pricePerToken}
							onChange={(e) => {
								setPricePerToken(e.target.value);
							}}
							helperText="Enter the amount in FIL"
							FormHelperTextProps={HelperProps}
							InputProps={InputProps}
						/>
					</Box>
					<Box sx={{ mt: 2 }}>
						<TextField
							placeholder="Enter minimun purchase"
							type="number"
							size="small"
							value={minimumPurchase}
							onChange={(e) => {
								setMinimumPurchase(e.target.value);
							}}
							helperText="Minimum token's to access dataset."
							FormHelperTextProps={HelperProps}
							InputProps={InputProps}
						/>
					</Box>
					<Box
						sx={{
							backgroundColor: "#256afe",
							padding: "6px 12px",
							borderRadius: "4px",
							mt: 3,
							cursor: "pointer",
							minWidth: "100px",
						}}
						onClick={createNewToken}
					>
						{loading ? (
							<CircularProgress size={14} sx={{ color: "white" }} />
						) : (
							"Create Token"
						)}
					</Box>
				</Box>
			</Box>
		</Dialog>
	);
};
