import React, { useContext } from 'react'
import { Button, Card, Icon, Image, Label, Popup } from 'semantic-ui-react'
import moment from 'moment';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import MyPopup from '../utils/MyPopup';
const PostCard = ({post : {body, createdAt, id, username, likeCount, commentCount, likes}}) => {
    const contexts = useContext(AuthContext);

    return (
        <Card fluid>
            <Card.Content>
                <Image
                    floated="right"
                    size="mini"
                    src="https://react.semantic-ui.com/images/avatar/large/jenny.jpg"
                />
                <Card.Header>{username}</Card.Header>
                <Card.Meta as={Link} to={`/posts/${id}`}>
                    {moment(createdAt).fromNow(true)}
                </Card.Meta>
                <Card.Description>{body}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <LikeButton post={{ username, id, likes, likeCount }} />
                <MyPopup content="Comment on post">
                    <Button
                        labelPosition="right"
                        as={Link}
                        to={`/posts/${id}`}
                    >
                        <Button color="blue" basic>
                            <Icon name="comment" />
                        </Button>
                        <Label basic color="blue" pointing="left">
                            {commentCount}
                        </Label>
                    </Button>
                </MyPopup>

                {contexts.user && contexts.user.username === username && (
                    <DeleteButton postId={id} />
                )}
            </Card.Content>
        </Card>
    );
}

export default PostCard
