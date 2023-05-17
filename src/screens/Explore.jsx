import "./Explore.css";
import "../styles/dscard.css";
import { Box } from "@mui/material";
import { Navbar } from "../components/Navbar";
import React, { useEffect, useState } from "react";
import { getDatasets, searchDatasets } from "../api/dataset";
import { SearchComponent } from "../components/search/SearchComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader } from "../components/Loader";
import { BsDownload } from "react-icons/bs";
import { IoMdOpen } from "react-icons/io";
import { download } from "../utils/download";
import { getShortAddress } from "../utils/addressShort";

export const Explore = () => {
	const [images, setImages] = useState([]);
	const [loading, setLoading] = useState(true);
	const search = useLocation().search;
	const query = new URLSearchParams(search).get("query");
	const navigate = useNavigate();

	async function getImages() {
		setLoading(true);
		const repos = await getDatasets();
		setImages(repos);
		setLoading(false);
	}

	async function searchImages(query) {
		setLoading(true);
		const repos = await searchDatasets(query);
		setImages(repos);
		setLoading(false);
	}

	useEffect(() => {
		if (query && query !== "") {
			searchImages(query);
		} else {
			getImages();
		}
	}, [query]);

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
					maxWidth: "840px",
				}}
			>
				<Box sx={{ display: "flex", justifyContent: "space-between" }}>
					<h2>Explore</h2>
					<SearchComponent />
				</Box>

				<Box mt={2}>
					{loading ? (
						<Loader />
					) : (
						images.map((d, i) => {
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
													onClick={() => {}}
												>
													view versions
												</p>
											</Box>
											<Box className="creator">
												<p>Maintained by&nbsp;</p>
												<Box
													sx={{
														"&:hover": {
															textDecoration: "underline",
														},
														cursor: "pointer",
													}}
													onClick={() => navigate("/profile/" + ds.creator)}
												>
													{getShortAddress(ds.creator)}
												</Box>
												<IoMdOpen
													style={{ color: "white" }}
													className="open-creator-icon"
												/>
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
										<p>Uploaded at {new Date(ds.timestamp).toDateString()}</p>
									</Box>
								</Box>
							);
						})
					)}
				</Box>
			</Box>
		</Box>
	);
};
