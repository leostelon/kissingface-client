import "./Profile.css";
import "../styles/dscard.css";
import React, { useEffect, useState } from "react";
import { Box, TextField, Tooltip } from "@mui/material";
import { Navbar } from "../components/Navbar";
import { useParams } from "react-router-dom";
import { uploadDataset, userDatasets } from "../api/dataset";
import { BsDatabase } from "react-icons/bs";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { TbBoxModel2 } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { Loader } from "../components/Loader";
import EmptyBox from "../assets/629-empty-box.gif";
import { downloadURI } from "../utils/download";
import { BsDownload } from "react-icons/bs";
import { toast } from "react-toastify";
import { CreateAccessTokenDialog } from "../components/CreateAccessTokenDialog";

export const Profile = () => {
	const [loading, setLoading] = useState(true);
	const [token, setToken] = useState("");
	const [menuIndex, setMenuIndex] = useState(0);
	const [datasets, setDatasets] = useState([]);
	const [file, setFile] = useState();
	const [name, setName] = useState("filename");
	const [version, setVersion] = useState("versionname");
	const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
	const [selectedDatasetid, setSelectedDatasetid] = useState();

	const { user } = useParams();

	async function getDatasets(user) {
		setLoading(true);
		const repos = await userDatasets(user);
		setDatasets(repos);
		setLoading(false);
	}

	async function checkIfuserLoggedIn() {
		const token = localStorage.getItem("token");
		if (token && token !== "") {
			setToken(token);
		}
	}

	async function uploadFile() {
		if (!file) return alert("Please select a file!");
		if (!name || name === "")
			return alert("Please enter a name for this dataset.");
		if (!version || version === "")
			return alert("Please enter a version for this dataset.");

		const response = await uploadDataset(file, `${name}:${version}`);
		console.log(response);
	}

	async function download(file, version) {
		// Check if logged in.
		let token = localStorage.getItem("token");
		if (!token || token !== "" || token !== "undefined") {
			return toast("Please connect wallet to download", { type: "info" });
		}
		// Check access
		downloadURI(file, version);
	}

	function handleTokenDialogClose() {
		setTokenDialogOpen(false);
	}

	useEffect(() => {
		getDatasets(user);
		checkIfuserLoggedIn();
	}, [user]);

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<Navbar />
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					width: "100%",
					maxWidth: "1240px",
				}}
			>
				<Box className="profile">
					<Box className="profile-navigation">
						<Box
							onClick={() => setMenuIndex(0)}
							className={`item ${menuIndex === 0 ? "selected" : ""}`}
						>
							<p>Datasets</p>
							<BsDatabase />
						</Box>
						<Box
							onClick={() => setMenuIndex(1)}
							className={`item ${menuIndex === 1 ? "selected" : ""}`}
						>
							<p>Models</p>
							<TbBoxModel2 />
						</Box>{" "}
						{token !== "" && (
							<Box
								onClick={() => setMenuIndex(2)}
								className={`item ${menuIndex === 2 ? "selected" : ""}`}
							>
								<p>Settings</p>
								<IoSettingsOutline />
							</Box>
						)}
					</Box>

					<CreateAccessTokenDialog
						isOpen={tokenDialogOpen}
						handleExternalClose={handleTokenDialogClose}
						datasetId={selectedDatasetid}
					/>

					{menuIndex === 0 && (
						<Box sx={{ flex: 1, width: "100%" }}>
							{loading ? (
								<Loader />
							) : datasets.length === 0 ? (
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										padding: 2,
									}}
								>
									<Box
										sx={{
											textAlign: "center",
											border: "2px solid grey",
											borderStyle: "dotted",
											p: 4,
											backgroundColor: "#1b1c1d",
										}}
									>
										<h3
											style={{
												color: "grey",
											}}
										>
											You have 0 datasets, try uploading one.😃
										</h3>
										<AiOutlineCloudUpload size={80} />
										<Box
											style={{
												marginBottom: "16px",
											}}
										>
											<input
												type="file"
												name="file"
												id="file"
												onChange={(e) => setFile(e.target.files[0])}
											/>
										</Box>
										<Box sx={{ mt: 1 }}>
											<TextField
												placeholder="Enter dataset name"
												size="small"
												value={name}
												onChange={(e) => {
													setName(e.target.value);
												}}
												sx={{
													width: "100%",
												}}
												InputProps={{
													style: {
														color: "white",
														border: "1px solid white",
													},
												}}
											/>
											<TextField
												placeholder="Enter version"
												size="small"
												value={version}
												onChange={(e) => {
													setVersion(e.target.value);
												}}
												sx={{
													width: "100%",
													mt: 2,
													mb: 2,
												}}
												InputProps={{
													style: {
														color: "white",
														border: "1px solid white",
													},
												}}
											/>
										</Box>
										<Box
											style={{
												backgroundColor: "#256afe",
												padding: "6px 16px",
												fontWeight: 500,
												borderRadius: "4px",
												cursor: "pointer",
											}}
											onClick={uploadFile}
										>
											Upload File
										</Box>
									</Box>
								</Box>
							) : (
								<Box px={4}>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
											mb: 2,
										}}
									>
										<h1>Datasets</h1>
										<Box
											style={{
												backgroundColor: "#256afe",
												padding: "6px 16px",
												fontWeight: 500,
												borderRadius: "4px",
												cursor: "pointer",
											}}
											onClick={() => setMenuIndex(3)}
										>
											Upload File
										</Box>
									</Box>

									{datasets.map((d, i) => {
										const ds = d.data;
										return (
											<Box className="dscard" key={i}>
												<Box
													display="flex"
													alignItems={"center"}
													justifyContent={"space-between"}
												>
													<Box>
														<h3>{ds.name.split("/")[1]}</h3>
														<Box>
															<Box display={"flex"}>
																<Box className="tag" sx={{ mr: "4px" }}>
																	:{ds.version}
																</Box>

																{ds.private && (
																	<Box
																		className="tag"
																		sx={{
																			backgroundColor: "#ff1616 !important",
																		}}
																	>
																		Private
																	</Box>
																)}
															</Box>
															<p
																style={{
																	fontWeight: "500",
																	fontSize: "12px",
																	marginTop: "4px",
																	textDecoration: "underline",
																	color: "white",
																	cursor: "pointer",
																}}
																onClick={() => {
																	setName(ds.name);
																}}
															>
																view versions
															</p>
														</Box>
													</Box>
													<Box
														className="dscard-download"
														onClick={() => download(ds.file, ds.version)}
													>
														<BsDownload color="white" />
													</Box>
												</Box>
												<Box
													display="flex"
													justifyContent="space-between"
													alignItems={"center"}
													sx={{
														marginTop: "12px",
														fontWeight: "600",
														fontSize: "12px",
													}}
												>
													<p>
														Uploaded at {new Date(ds.timestamp).toDateString()}
													</p>
													{!ds.tokenAccessEnabled && (
														<Tooltip
															title="Enable access to users."
															placement="top"
														>
															<p
																className="access-enabled"
																onClick={() => {
																	setSelectedDatasetid(ds.id);
																	setTokenDialogOpen(true);
																}}
															>
																Create access token⚠️
															</p>
														</Tooltip>
													)}
												</Box>
											</Box>
										);
									})}
								</Box>
							)}
						</Box>
					)}
					{menuIndex === 1 && (
						<Box sx={{ flex: 1 }}>
							{loading ? (
								<Loader />
							) : (
								<Box
									sx={{
										width: "100%",
										alignItems: "center",
										flexDirection: "column",
										display: "flex",
										borderRadius: "8px",
										p: 3,
									}}
								>
									<img width={"100px"} src={EmptyBox} alt="empty box" />
									<h3
										style={{
											color: "grey",
											marginTop: "12px",
											textAlign: "center",
										}}
									>
										Models will be rolledd out in the next update😃
									</h3>
								</Box>
							)}
						</Box>
					)}
					{menuIndex === 2 && (
						<Box sx={{ flex: 1 }}>
							<h2>Settings</h2>
							<br />
							<h3>CLI</h3>
							<p style={{ fontWeight: "500", marginTop: "4px" }}>
								In order to push images from your computer you need to login to
								CLI using the token provided below. Enter to below command in
								powershell or command line.
							</p>

							<br />
							<h3>Token</h3>
						</Box>
					)}
					{menuIndex === 3 && (
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								padding: 2,
								width: "100%",
							}}
						>
							<Box
								sx={{
									textAlign: "center",
									border: "2px solid grey",
									borderStyle: "dotted",
									p: 4,
									backgroundColor: "#1b1c1d",
								}}
							>
								<h3
									style={{
										color: "grey",
									}}
								>
									Upload your dataset.😃
								</h3>
								<AiOutlineCloudUpload size={80} />
								<Box
									style={{
										marginBottom: "16px",
									}}
								>
									<input
										type="file"
										name="file"
										id="file"
										onChange={(e) => setFile(e.target.files[0])}
									/>
								</Box>
								<Box sx={{ mt: 1 }}>
									<TextField
										placeholder="Enter dataset name"
										size="small"
										value={name}
										onChange={(e) => {
											setName(e.target.value);
										}}
										sx={{
											width: "100%",
										}}
										InputProps={{
											style: {
												color: "white",
												border: "1px solid white",
											},
										}}
									/>
									<TextField
										placeholder="Enter version"
										size="small"
										value={version}
										onChange={(e) => {
											setVersion(e.target.value);
										}}
										sx={{
											width: "100%",
											mt: 2,
											mb: 2,
										}}
										InputProps={{
											style: {
												color: "white",
												border: "1px solid white",
											},
										}}
									/>
								</Box>
								<Box
									style={{
										backgroundColor: "#256afe",
										padding: "6px 16px",
										fontWeight: 500,
										borderRadius: "4px",
										cursor: "pointer",
									}}
									onClick={uploadFile}
								>
									Upload File
								</Box>
							</Box>
						</Box>
					)}
				</Box>
			</Box>
		</Box>
	);
};
