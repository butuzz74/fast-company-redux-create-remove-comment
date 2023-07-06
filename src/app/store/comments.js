import { createSlice } from "@reduxjs/toolkit";
import commentService from "../services/comment.service";

const commentsSlice = createSlice({
    name: "comments",
    initialState: {
        entities: null,
        isLoading: true,
        error: null
    },
    reducers: {
        commentsRequested: (state) => {
            state.isLoading = true;
        },
        commentsReceived: (state, action) => {
            state.entities = action.payload;
            state.isLoading = false;
        },
        commentsRequestFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        remove: (state, action) => {
            state.entities = state.entities.filter(
                (el) => el._id !== action.payload
            );
            state.isLoading = false;
        },
        create: (state, action) => {
            state.entities.push(action.payload);
            state.isLoading = false;
        }
    }
});

const { reducer: commentsReducer, actions } = commentsSlice;
const { commentsRequested, commentsReceived, commentsRequestFailed, remove, create } =
    actions;

export const loadCommentsList = (userId) => async (dispatch) => {
    dispatch(commentsRequested());
    try {
        const { content } = await commentService.getComments(userId);
        dispatch(commentsReceived(content));
    } catch (error) {
        dispatch(commentsRequestFailed(error.message));
    }
};
export const removeComment = (id) => async (dispatch) => {
    dispatch(commentsRequested());
    try {
        const { content } = await commentService.removeComment(id);
        if (content === null) {
            dispatch(remove(id));
        }
    } catch (error) {
        dispatch(commentsRequestFailed(error.message));
    }
};
export const createComment = (data) => async (dispatch) => {
    dispatch(commentsRequested());
    try {
        const { content } = await commentService.createComment(data);

        dispatch(create(content));
    } catch (error) {
        dispatch(commentsRequestFailed(error.message));
    }
};

export const getComments = () => (state) => state.comments.entities;
export const getCommentsLoadingStatus = () => (state) =>
    state.comments.isLoading;

export default commentsReducer;
