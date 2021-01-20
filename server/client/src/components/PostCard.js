import React, { useContext } from 'react'
import { Button, Card, Icon, Image, Label } from 'semantic-ui-react'
import moment from 'moment';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import LikeButton from './LikeButton';
const PostCard = ({post : {body, createdAt, id, username, likeCount, commentCount, likes}}) => {
    const contexts = useContext(AuthContext);
    function likePost() {

    }

    function commentOnPost() {

    }

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
                <LikeButton post={{id, likes, likeCount}} />
                <Button labelPosition="right" as={Link} to={`/posts/${id}`} onClick={likePost}>
                    <Button color="blue" basic>
                        <Icon name="comment" />
                    </Button>
                    <Label basic color="blue" pointing="left">
                        {commentCount}
                    </Label>
                </Button>
                {contexts.user && contexts.user.username === username && (
                    <Button as="div" color="red" floated="right" onClick={() => console.log('Delete Post')}>
                        <Icon name="trash" style={{margin: 0}}/>
                    </Button>
                )}
            </Card.Content>
        </Card>
    );
}

export default PostCard
